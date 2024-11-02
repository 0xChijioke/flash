/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  11155111: {
    FlashVault: {
      address: "0x207ABAcEe3Be9EFEf87c600Dcd2C0511b659B050",
      abi: [
        {
          inputs: [
            {
              internalType: "address",
              name: "_owner",
              type: "address",
            },
            {
              internalType: "address",
              name: "_provider",
              type: "address",
            },
            {
              internalType: "contract IERC20",
              name: "_usdcAddress",
              type: "address",
            },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "target",
              type: "address",
            },
          ],
          name: "AddressEmptyCode",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "AddressInsufficientBalance",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "spender",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "allowance",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "needed",
              type: "uint256",
            },
          ],
          name: "ERC20InsufficientAllowance",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "balance",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "needed",
              type: "uint256",
            },
          ],
          name: "ERC20InsufficientBalance",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "approver",
              type: "address",
            },
          ],
          name: "ERC20InvalidApprover",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "receiver",
              type: "address",
            },
          ],
          name: "ERC20InvalidReceiver",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "ERC20InvalidSender",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "spender",
              type: "address",
            },
          ],
          name: "ERC20InvalidSpender",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "receiver",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "assets",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "max",
              type: "uint256",
            },
          ],
          name: "ERC4626ExceededMaxDeposit",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "receiver",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "shares",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "max",
              type: "uint256",
            },
          ],
          name: "ERC4626ExceededMaxMint",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "shares",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "max",
              type: "uint256",
            },
          ],
          name: "ERC4626ExceededMaxRedeem",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "assets",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "max",
              type: "uint256",
            },
          ],
          name: "ERC4626ExceededMaxWithdraw",
          type: "error",
        },
        {
          inputs: [],
          name: "FailedInnerCall",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "action",
              type: "string",
            },
          ],
          name: "FlashVault__AmountCantBeZero",
          type: "error",
        },
        {
          inputs: [],
          name: "FlashVault__ETHWithdrawalFailed",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "received",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "debt",
              type: "uint256",
            },
          ],
          name: "FlashVault__InsufficientReceivedAmount",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "requested",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "available",
              type: "uint256",
            },
          ],
          name: "FlashVault__InsufficientShares",
          type: "error",
        },
        {
          inputs: [],
          name: "FlashVault__LossExceedsThreshold",
          type: "error",
        },
        {
          inputs: [],
          name: "FlashVault__NoETHBalance",
          type: "error",
        },
        {
          inputs: [],
          name: "FlashVault__NoProfitOpportunity",
          type: "error",
        },
        {
          inputs: [],
          name: "FlashVault__NoShares",
          type: "error",
        },
        {
          inputs: [],
          name: "FlashVault__OnlyOwner",
          type: "error",
        },
        {
          inputs: [],
          name: "FlashVault__PricesMustDiffer",
          type: "error",
        },
        {
          inputs: [],
          name: "FlashVault__UnauthorizedCaller",
          type: "error",
        },
        {
          inputs: [],
          name: "MathOverflowedMulDiv",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "OwnableInvalidOwner",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "OwnableUnauthorizedAccount",
          type: "error",
        },
        {
          inputs: [],
          name: "ReentrancyGuardReentrantCall",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "token",
              type: "address",
            },
          ],
          name: "SafeERC20FailedOperation",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "spender",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
          ],
          name: "Approval",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "user",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "shares",
              type: "uint256",
            },
          ],
          name: "AssetDeposited",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "user",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "shares",
              type: "uint256",
            },
          ],
          name: "AssetWithdrawn",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "assets",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "shares",
              type: "uint256",
            },
          ],
          name: "Deposit",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "initiator",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "premium",
              type: "uint256",
            },
          ],
          name: "FlashLoanReceived",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "previousOwner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "OwnershipTransferred",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "tokenIn",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amountIn",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "address",
              name: "tokenOut",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amountOut",
              type: "uint256",
            },
          ],
          name: "TokenSwapped",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "executor",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "tokenOut",
              type: "address",
            },
            {
              indexed: false,
              internalType: "int256",
              name: "net",
              type: "int256",
            },
          ],
          name: "TradeExecuted",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
          ],
          name: "Transfer",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "receiver",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "assets",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "shares",
              type: "uint256",
            },
          ],
          name: "Withdraw",
          type: "event",
        },
        {
          inputs: [],
          name: "ADDRESSES_PROVIDER",
          outputs: [
            {
              internalType: "contract IPoolAddressesProvider",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "POOL",
          outputs: [
            {
              internalType: "contract IPool",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "address",
              name: "spender",
              type: "address",
            },
          ],
          name: "allowance",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "spender",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
          ],
          name: "approve",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "asset",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "balanceOf",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "shares",
              type: "uint256",
            },
          ],
          name: "convertToAssets",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "assets",
              type: "uint256",
            },
          ],
          name: "convertToShares",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "decimals",
          outputs: [
            {
              internalType: "uint8",
              name: "",
              type: "uint8",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "assets",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "receiver",
              type: "address",
            },
          ],
          name: "deposit",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_pool0",
              type: "address",
            },
            {
              internalType: "address",
              name: "_pool1",
              type: "address",
            },
            {
              internalType: "address",
              name: "_tokenOut",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "_amount",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "_isToken0USDC",
              type: "bool",
            },
          ],
          name: "executeArbitrage",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "asset",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "premium",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "initiator",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "params",
              type: "bytes",
            },
          ],
          name: "executeOperation",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "flashFunction",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_token",
              type: "address",
            },
          ],
          name: "getBalance",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "maxDeposit",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "maxMint",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "maxRedeem",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "maxWithdraw",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "shares",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "receiver",
              type: "address",
            },
          ],
          name: "mint",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "name",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "owner",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "assets",
              type: "uint256",
            },
          ],
          name: "previewDeposit",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "shares",
              type: "uint256",
            },
          ],
          name: "previewMint",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "shares",
              type: "uint256",
            },
          ],
          name: "previewRedeem",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "assets",
              type: "uint256",
            },
          ],
          name: "previewWithdraw",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "shares",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "receiver",
              type: "address",
            },
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "redeem",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "renounceOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_flashFunction",
              type: "address",
            },
          ],
          name: "setFlashFunction",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "symbol",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "totalAssets",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "totalSupply",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
          ],
          name: "transfer",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
          ],
          name: "transferFrom",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "transferOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "int256",
              name: "amount0Delta",
              type: "int256",
            },
            {
              internalType: "int256",
              name: "amount1Delta",
              type: "int256",
            },
            {
              internalType: "bytes",
              name: "_data",
              type: "bytes",
            },
          ],
          name: "uniswapV3SwapCallback",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "usdc",
          outputs: [
            {
              internalType: "contract IERC20",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "assets",
              type: "uint256",
            },
          ],
          name: "userDeposit",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "assets",
              type: "uint256",
            },
          ],
          name: "userWithdraw",
          outputs: [
            {
              internalType: "uint256",
              name: "shares",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "assets",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "receiver",
              type: "address",
            },
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "withdraw",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "withdrawETH",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          stateMutability: "payable",
          type: "receive",
        },
      ],
      inheritedFunctions: {
        owner: "@openzeppelin/contracts/access/Ownable.sol",
        renounceOwnership: "@openzeppelin/contracts/access/Ownable.sol",
        transferOwnership: "@openzeppelin/contracts/access/Ownable.sol",
        allowance: "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol",
        approve: "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol",
        asset: "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol",
        balanceOf: "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol",
        convertToAssets:
          "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol",
        convertToShares:
          "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol",
        decimals: "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol",
        deposit: "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol",
        maxDeposit:
          "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol",
        maxMint: "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol",
        maxRedeem: "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol",
        maxWithdraw:
          "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol",
        mint: "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol",
        name: "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol",
        previewDeposit:
          "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol",
        previewMint:
          "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol",
        previewRedeem:
          "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol",
        previewWithdraw:
          "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol",
        redeem: "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol",
        symbol: "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol",
        totalAssets:
          "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol",
        totalSupply:
          "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol",
        transfer: "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol",
        transferFrom:
          "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol",
        withdraw: "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol",
        uniswapV3SwapCallback:
          "@uniswap/v3-core/contracts/interfaces/callback/IUniswapV3SwapCallback.sol",
        ADDRESSES_PROVIDER:
          "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol",
        POOL: "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol",
        executeOperation:
          "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol",
      },
    },
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
