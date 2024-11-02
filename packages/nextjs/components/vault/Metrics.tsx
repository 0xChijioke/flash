import React from "react";
import { formatEther, formatUnits } from "viem";
import { useAccount } from "wagmi";
import { DAI_DECIMALS, USDC_DECIMALS } from "~~/app/config";
import useBalances from "~~/hooks/useBalances";

const Metrics = () => {
  const { address: connectedAddress } = useAccount();
  const {
    userUSDCBalance,
    totalAssets,
    totalSupply,
    loading,
    userShareBalance,
  } = useBalances();
  
  return (
    <div className="lg:max-w-6xl w-full space-y-2 mx-auto p-4">
      <h2 className="text-2xl text-center font-bold mb-6">Vault Metrics</h2>
      <div className="flex flex-col py-4 lg:flex-row gap-4">
        <MetricCard title="Total Assets" value={totalAssets} unit="USDC" isLoading={loading.totalAssets} />
        <MetricCard title="Total Shares" value={totalSupply} unit="FLH" isLoading={loading.totalSupply} />
        <MetricCard title="Your FLH Shares" value={userShareBalance} unit="FLH" isLoading={loading.userShareBalance} isConnected={!!connectedAddress} />
        <MetricCard title="Your USDC Balance" value={userUSDCBalance?.value} unit="USDC" isLoading={loading.userUSDCBalance} isConnected={!!connectedAddress} />
      </div>
    </div>
  );
};




const MetricCard = ({ title, value, unit, isLoading, isConnected }: any) => {
  const formattedValue = !isLoading 
    ? Number(formatUnits(value || 0, USDC_DECIMALS)).toFixed(2)
    : null;

  return (
    <div className="bg-white overflow-hidden shadow-md rounded-lg lg:p-10 py-8 px-20 flex my-2 flex-col items-center">
      <h3 className="font-normal text-center text-slate-600 text-lg mb-2">{title}</h3>
      <div className="flex items-center flex-row-reverse">
        {unit === "USDC" && (
          <img src="//logotyp.us/file/usd-coin.svg" alt="USDC" className="h-12 w-12" />
        )}
        <p className="text-4xl font-bold text-center flex whitespace-nowrap">
          {isLoading ? (
            <span className="loading loading-spinner flex justify-center text-info"></span>
          ) : isConnected !== false ? (
            `${formattedValue} ${unit !== "USDC" ? unit : ""}`
          ) : (
            <span className="text-gray-400 text-sm">Connect wallet to view</span>
          )}
        </p>
      </div>
    </div>
  );
};


export default Metrics;
