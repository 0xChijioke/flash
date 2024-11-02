// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/utils/math/Math.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { ERC4626 } from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@uniswap/v3-core/contracts/interfaces/callback/IUniswapV3SwapCallback.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";

/**
 * @title FlashVault
 * @dev A vault contract designed to generate potential yield for shareholders
 * by leveraging vault liquidity and flash loans to execute arbitrage swaps across DEXs, with inherent risks of loss.
 */
contract FlashVault is 
	Ownable,
	ERC4626, 
	ReentrancyGuard, 
	IUniswapV3SwapCallback, 
	FlashLoanSimpleReceiverBase
	{
	using SafeERC20 for IERC20;

	IERC20 public immutable usdc;
	address public flashFunction;

    uint160 private constant MIN_SQRT_RATIO = 4295128739;
    uint160 private constant MAX_SQRT_RATIO = 1461446703485210103287273052203988822378723970342;

	// Events
	event TokenSwapped(
		address indexed tokenIn,
		uint256 amountIn,
		address indexed tokenOut,
		uint256 amountOut
	);
	event FlashLoanReceived(
		address indexed initiator,
		uint256 amount,
		uint256 premium
	);
	event AssetDeposited(address indexed user, uint256 shares);
	event AssetWithdrawn(address indexed user, uint256 amount, uint256 shares);
	event TradeExecuted(address indexed executor, address indexed tokenOut, int256 net);

	// Errors
	error FlashVault__OnlyOwner();
	error FlashVault__InsufficientReceivedAmount(
		uint256 received,
		uint256 debt
	);
	error FlashVault__InsufficientShares(uint256 requested, uint256 available);
	error FlashVault__AmountCantBeZero(string action);
	error FlashVault__LossExceedsThreshold();
	error FlashVault__NoProfitOpportunity();
    error FlashVault__NoETHBalance();
    error FlashVault__ETHWithdrawalFailed();
	error FlashVault__UnauthorizedCaller();
	error FlashVault__PricesMustDiffer();
	error FlashVault__NoShares();

	constructor(
		address _owner,
		address _provider,
		IERC20 _usdcAddress
	)
		ERC20("Flash", "FLH")
		ERC4626(_usdcAddress)
		Ownable(_owner)
		FlashLoanSimpleReceiverBase(IPoolAddressesProvider(_provider))
	{
		usdc = _usdcAddress;
	}

	// Modifier to restrict access
    modifier onlyFlashFunction() {
        if (msg.sender != flashFunction) revert FlashVault__UnauthorizedCaller();
        _;
    }

	// Set the flashFunction address
	function setFlashFunction(address _flashFunction) external onlyOwner {
		flashFunction = _flashFunction;
	}

	/**
	* @dev Modifier to ensure the caller has shares in the vault.
	*/
	modifier hasShares() {
		if (balanceOf(msg.sender) == 0) revert FlashVault__NoShares();
		_;
	}

	/**
	 * @dev Deposit assets into the vault.
	 * @param assets The amount of assets to deposit.
	 * @return shares The number of shares minted for the deposit.
	 */
	function userDeposit(
		uint256 assets
	) external nonReentrant returns (uint256) {
		if (assets == 0) revert FlashVault__AmountCantBeZero("deposit");
		uint256 shares = previewDeposit(assets);
		_deposit(msg.sender, msg.sender, assets, shares);
		emit AssetDeposited(msg.sender, shares);
		return shares;
	}

	/**
	 * @dev Withdraw assets from the vault.
	 * @param assets The amount of assets to withdraw.
	 * @return shares The number of shares burnt for the withdrawal.
	 */
	function userWithdraw(
		uint256 assets
	) external nonReentrant returns (uint256 shares) {
		if (assets == 0) revert FlashVault__AmountCantBeZero("withdraw");

		shares = withdraw(assets, msg.sender, msg.sender);

		emit AssetWithdrawn(msg.sender, assets, shares);
	}

	/**
	 * @dev Execute flash loan operation.
	 * @param asset The asset address.
	 * @param amount The amount borrowed.
	 * @param premium The premium amount.
	 * @param initiator The initiator address.
	 * @param params Additional parameters.
	 * @return True if successful.
	 */
	function executeOperation(
		address asset,
		uint256 amount,
		uint256 premium,
		address initiator,
		bytes calldata params
	) external override nonReentrant returns (bool) {

    	(
			address pool0,
			address pool1,
			address tokenOut,
			bool isToken0USDC
		) =
        abi.decode(params, (address, address, address, bool));

		_executeTrade(pool0, pool1, tokenOut, amount, isToken0USDC);

		uint256 totalAmount = amount + premium;
		IERC20(asset).approve(address(POOL), totalAmount);

		return true;
	}

	/**
	* @dev Initiates a trade between two pools.
	* @param _pool0 The address of the first pool.
	* @param _pool1 The address of the second pool.
	* @param _tokenOut The address of the token being swapped.
	* @param _amount The amount to trade.
	* @param _isToken0USDC Boolean indicating if token0 is USDC.
	*/
	function executeArbitrage(
		address _pool0,
		address _pool1,
		address _tokenOut,
		uint256 _amount,
     	bool _isToken0USDC
	) external onlyFlashFunction {

		// uint256 expectedProfit = simulateProfit(_pool0, _pool1, _amount, _isToken0USDC);

		// if (expectedProfit < threshold) {
		//     revert FlashVault__NoProfitOpportunity();
		// }

		uint256 tokenInBalance = getBalance(address(usdc));
		
		if (tokenInBalance >= _amount) {
			_executeTrade(_pool0, _pool1, _tokenOut, _amount, _isToken0USDC);
		} else {
			// uint256 amountNeeded = _amount - tokenOutBalance;
			_requestFlashLoan(_pool0, _pool1, _tokenOut, _amount, _isToken0USDC);
		}
	}

	/**
	* @dev Executes token swaps between two pools.
	* @param pool0 The first pool address.
	* @param pool1 The second pool address.
	* @param tokenOut The address of the token being swapped.
	* @param amount The amount to trade.
	* @param isToken0USDC Boolean indicating if token0 is USDC.
	*/
	function _executeTrade(
		address pool0,
		address pool1,
		address tokenOut,
		uint256 amount,
     	bool isToken0USDC
	) internal {
    	uint256 initialUSDCBalance = IERC20(usdc).balanceOf(address(this));

        usdc.approve(address(pool0), amount);

		IUniswapV3Pool(pool0).swap({
            recipient: address(this),
            zeroForOne: isToken0USDC,
            amountSpecified: int256(amount),
            sqrtPriceLimitX96: isToken0USDC ? MIN_SQRT_RATIO + 1 : MAX_SQRT_RATIO - 1,
            data: abi.encode(pool0, usdc, pool0)
        });

		uint256 receivedAmount = IERC20(tokenOut).balanceOf(address(this));
		emit TokenSwapped(address(usdc), amount, tokenOut, receivedAmount);

		IERC20(tokenOut).approve(pool1, receivedAmount);

		IUniswapV3Pool(pool1).swap({
            recipient: address(this),
            zeroForOne: true, // zeroForOne
			amountSpecified: int256(receivedAmount),
            sqrtPriceLimitX96: MIN_SQRT_RATIO + 1,
            data: abi.encode(pool1, tokenOut, pool1)
		});


    	uint256 finalUSDCBalance = IERC20(usdc).balanceOf(address(this));
		int256 netResult = int256(finalUSDCBalance) - (int256(initialUSDCBalance) - int256(amount));
		
		emit TradeExecuted(msg.sender, tokenOut, netResult);
	}

	/**
	 * @dev Get the vault balance for a specific token.
	 * @param _token The token address.
	 * @return Balance of the token held by the vault.
	 */
	function getBalance(address _token) public view returns (uint256) {
		return IERC20(_token).balanceOf(address(this));
	}

	/**
	 * @dev Allows the owner to withdraw all ETH from the contract.
	 */
	function withdrawETH() external onlyOwner {
		uint256 contractETHBalance = address(this).balance;
        if (address(this).balance == 0) revert FlashVault__NoETHBalance();

		// Transfer all ETH to the owner
		(bool success, ) = owner().call{ value: contractETHBalance }("");
        if (!success) revert FlashVault__ETHWithdrawalFailed();
	}
		
	/**
	* @dev Requests a flash loan.
	* @param _pool0 The first pool for the swap.
	* @param _pool1 The second pool for the swap.
	* @param _tokenOut The token to swap.
	* @param _amount The amount to borrow.
	* @param _isToken0USDC Boolean indicating if token0 is USDC.
	*/
	function _requestFlashLoan(
		address _pool0,
		address _pool1,
		address _tokenOut,
		uint256 _amount,
		bool _isToken0USDC
	) private {
		bytes memory params = abi.encode(_pool0, _pool1, _tokenOut,  _isToken0USDC);

		POOL.flashLoanSimple(address(this), address(usdc), _amount, params, 0);
	}
	
	/**
	* @dev Callback function required by Uniswap V3.
	* @param amount0Delta The amount of token0.
	* @param amount1Delta The amount of token1.
	* @param _data Encoded data.
	*/
   	function uniswapV3SwapCallback(
        int256 amount0Delta,
        int256 amount1Delta,
        bytes calldata _data
    ) external override {
        require(amount0Delta > 0 || amount1Delta > 0, "Invalid amounts");
        
        (address to, address tokenIn, address pool) = abi.decode(_data, (address, address, address));

        require(msg.sender == pool,"Unauthorized caller");

    	uint256 transferAmount;

		if (tokenIn == IUniswapV3Pool(pool).token0()) {
			transferAmount = uint256(amount0Delta);
		} else {
			transferAmount = uint256(amount1Delta);
		}

		IERC20(tokenIn).transfer(to, transferAmount);
    }

	/**
	 * @dev Fallback to receive ETH.
	 */
	receive() external payable {}
}
