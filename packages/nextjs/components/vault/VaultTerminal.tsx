"use client";

import { useContext, useEffect, useState } from "react";
import InputForm from "./InputForm";
import { erc20Abi, formatUnits, parseUnits } from "viem";
import { readContract, writeContract } from "viem/actions";
import { hardhat, sepolia } from "viem/chains";
import { useAccount, useBalance } from "wagmi";
import { USDC_ADDRESS, USDC_DECIMALS } from "~~/app/config";
import { ClientContext } from "~~/contexts/ClientContext";
import { useScaffoldContract, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { previewAssetsToShares } from "~~/utils/contract";

const VaultTerminal = () => {
  const { address } = useAccount();

  const walletClient = useContext(ClientContext);
  const [activeTab, setActiveTab] = useState<"Deposit" | "Withdraw">("Deposit");
  const [amount, setAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [estimatedShares, setEstimatedShares] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const { data: flashVault } = useScaffoldContract({
    contractName: "FlashVault",
    walletClient,
  });


  const { writeContractAsync: writeFlashVault } = useScaffoldWriteContract("FlashVault");

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (walletClient && address && amount && Number(amount) > 0) {
        await updatePreview();
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [amount]);

  const updatePreview = async () => {
    const { address, abi } = flashVault || {};

    if (!address || !abi) {
      console.error("FlashVault is not available.");
      setEstimatedShares("0");
      return;
    }

    const parsedAmount = BigInt(Number(amount) * 1e6);

    try {
      const result = await previewAssetsToShares(walletClient, address, abi, parsedAmount);
      setEstimatedShares(result || "0");
    } catch (error) {
      console.error("Error updating preview:", error);
      setEstimatedShares("0");
    }
  };

  const handleDeposit = async (amount: bigint) => {
    try {
      const currentAllowance = await readContract(walletClient!, {
        address: USDC_ADDRESS,
        abi: erc20Abi,
        functionName: "allowance",
        args: [address as string, flashVault?.address as string],
      });

      
  
      if (currentAllowance < amount) {
        const approvalResult = await handleApprove(amount);
        if (!approvalResult) {
          setStatus("Approval failed. Please try again.");
          return;
        }
  
      }
  
      const depositTx = await writeFlashVault({
        functionName: "userDeposit",
        args: [amount],
      });
  
      console.log("Deposit transaction sent:", depositTx);
  
      setStatus(`${activeTab} successful! 🎉`);
    } catch (error) {
      console.error("Deposit failed:", error);
      setStatus("Deposit failed. Please try again.");
    }
  };

  const handleApprove = async (amount: bigint) => {
    try {
      const approvalTx = await writeContract(walletClient!, {
        address: USDC_ADDRESS as string,
        abi: erc20Abi,
        functionName: "approve",
        args: [flashVault?.address as string, amount],
        chain: sepolia,
        account: address as string,
      });

    let attempts = 5; 
    const delay = 3000; 
    let currentAllowance;

    for (let i = 0; i < attempts; i++) {
      await new Promise(resolve => setTimeout(resolve, delay));

      currentAllowance = await readContract(walletClient!, {
        address: USDC_ADDRESS,
        abi: erc20Abi,
        functionName: "allowance",
        args: [address as string, flashVault?.address as string],
      });

      if (currentAllowance >= amount) {
        return true;
      }
    }

    console.warn("Approval not confirmed within the timeout period.");
    return false;
  } catch (error) {
    console.error("Error in handleApprove:", error);
    return false;
  }
};

  const handleWithdraw = async (amount: bigint) => {
    try {
      const withdrawTx = await writeFlashVault({
        functionName: "userWithdraw",
        args: [amount],
      });

      console.log("Withdraw transaction sent:", withdrawTx);

      setStatus(`${activeTab} successful! 🎉`);
    } catch (error) {
      console.error("Withdrawal failed:", error);
      setStatus("Withdrawal failed. Please try again.");
    }
  };

  const handleConfirmAction = async () => {
    if (!activeTab || !amount) return;

    setIsLoading(true);
    try {
      const parsedAmount = BigInt(Number(amount) * 1e6);

      if (activeTab === "Deposit") {
        await handleDeposit(parsedAmount);
      } else if (activeTab === "Withdraw") {
        await handleWithdraw(parsedAmount);
      }

      // setStatus(`${activeTab} successful! 🎉`);
      setTimeout(closeModal, 2000);
    } catch (error) {
      console.error(`${activeTab} failed:`, error);
      setStatus(`Failed to ${activeTab.toLowerCase()}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    openModal();
  };

  const openModal = async () => {
    setStatus(null);

    const validate = await validateInputs();
    if (!validate) {
      return;
    } else {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  const validateInputs = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setStatus("Enter a valid amount.");
      return false;
    }
    if (activeTab === "Deposit") {
      const balance = await readContract(walletClient!, {
        address: USDC_ADDRESS,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address as string],
      });

      if (Number(formatUnits(balance, 6)) < Number(amount)) {
        setStatus("Insufficient balance");
        return false;
      }
    }
    return true;
  };

  return (
    <div className="w-full flex flex-col p-10">
      <div role="tablist" className="tabs border-slate-500 tabs-bordered">
        <button
          role="tab"
          className={`tab text-lg uppercase ${activeTab === "Deposit" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("Deposit")}
        >
          Deposit
        </button>
        <button
          role="tab"
          className={`tab text-lg uppercase ${activeTab === "Withdraw" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("Withdraw")}
        >
          Withdraw
        </button>
      </div>
      <div role="tabpanel" className="tab-content pt-8 w-full flex flex-col justify-center items-center">
        <p className="h-4">{status}</p>
        <InputForm
          action={activeTab}
          amount={amount}
          setAmount={setAmount}
          connectedAddress={address as string}
          estimatedShares={estimatedShares}
          handleSubmit={handleSubmit}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50"></div>
          <div className="rounded-lg relative z-10 bg-white space-y-20 shadow-lg p-8 min-w-[30%]">
            <h3 className="font-bold text-center text-lg">Confirm {activeTab}</h3>
            <div className="flex justify-center py-8 whitespace-nowrap space-x-4">
              {activeTab} <br /> <strong>{amount} USDC</strong>
              <span> {activeTab === "Deposit" ? "into" : "from"} the Vault</span>
            </div>
            <div className="mt-4">
              {isLoading ? (
                <div className="flex space-y-2 flex-col items-center">
                  <div className="text-center">Processing...</div>
                  <progress className="progress w-56"></progress>
                </div>
              ) : (
                status && (
                  <p className={`text-${status.includes("Failed") ? "red" : "green"}-500 text-center`}>{status}</p>
                )
              )}
            </div>
            <div className="mt-4 flex justify-between">
              <button className="btn text-lg rounded-lg" onClick={closeModal} disabled={isLoading}>
                Cancel
              </button>
              <button
                className={`btn btn-primary text-lg rounded-lg ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={handleConfirmAction}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaultTerminal;
