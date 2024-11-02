import { formatUnits } from "viem";
import { readContract } from "viem/actions";
import { USDC_DECIMALS } from "~~/app/config";

export const previewAssetsToShares = async (
  walletClient: any,
  contractAddress: string,
  contractABI: any,
  assets: bigint,
): Promise<string | null> => {
  try {
    const shares = await readContract(walletClient, {
      address: contractAddress,
      abi: contractABI,
      functionName: "convertToShares",
      args: [assets],
    });
    return formatUnits(shares as bigint, USDC_DECIMALS);
  } catch (error) {
    console.error("Failed to preview assets to shares:", error);
    return null;
  }
};
