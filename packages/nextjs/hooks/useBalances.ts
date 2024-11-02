import { formatUnits } from "viem";
import { useAccount, useBalance } from "wagmi";
import { DAI_ADDRESS, DAI_DECIMALS, USDC_ADDRESS, USDC_DECIMALS } from "~~/app/config";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const useBalances = () => {
  const { address: connectedAddress } = useAccount();

  // Read vault balances using hooks directly
  const {
    data: vaultUSDCBalance,
    isLoading: isLoadingVaultUSDC,
    error: vaultUSDCError,
  } = useScaffoldReadContract({
    contractName: "FlashVault",
    functionName: "getBalance",
    args: [USDC_ADDRESS],
  });

  const {
    data: vaultDAIBalance,
    isLoading: isLoadingVaultDAI,
    error: vaultDAIError,
  } = useScaffoldReadContract({
    contractName: "FlashVault",
    functionName: "getBalance",
    args: [DAI_ADDRESS],
  });

  const { data: totalAssets, isLoading: isLoadingTotalAssets } = useScaffoldReadContract({
    contractName: "FlashVault",
    functionName: "totalAssets",
  });

  const { data: totalSupply, isLoading: isLoadingTotalSupply } = useScaffoldReadContract({
    contractName: "FlashVault",
    functionName: "totalSupply",
  });

  // Fetch user balances
  const { data: userUSDCBalance, isLoading: isLoadingUserUSDC } = useBalance({
    address: connectedAddress,
    token: USDC_ADDRESS,
  });

  const { data: userDAIBalance, isLoading: isLoadingUserDAI } = useBalance({
    address: connectedAddress,
    token: DAI_ADDRESS,
  });

  const { data: userShareBalance, isLoading: isLoadingUserShare } = useScaffoldReadContract({
    contractName: "FlashVault",
    functionName: "balanceOf",
    args: [connectedAddress],
  });

  // Centralized formatting function
  const formatBalance = (balance: bigint | undefined, decimals: number) => {
    return balance ? formatUnits(balance, decimals) : "0";
  };

  const loading = {
    totalAssets: isLoadingTotalAssets,
    totalSupply: isLoadingTotalSupply,
    userShareBalance: isLoadingUserShare,
    userUSDCBalance: isLoadingUserUSDC,
    userDAIBalance: isLoadingUserDAI,
    vaultUSDCBalance: isLoadingVaultUSDC,
    vaultDAIBalance: isLoadingVaultDAI,
  };

  return {
    vaultUSDCBalance: formatBalance(vaultUSDCBalance, USDC_DECIMALS),
    vaultDAIBalance: formatBalance(vaultDAIBalance, DAI_DECIMALS),
    userUSDCBalance,
    userDAIBalance,
    totalAssets,
    totalSupply,
    userShareBalance,
    loading,
  };
};

export default useBalances;
