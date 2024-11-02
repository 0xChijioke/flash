// InputForm.tsx
import React from "react";
import { IntegerInput } from "~~/components/scaffold-eth";

interface InputFormProps {
  action: "Deposit" | "Withdraw";
  amount: string;
  setAmount: (amount: string) => void;
  connectedAddress: string;
  estimatedShares: string;
  handleSubmit: (e: React.FormEvent) => void;
}

const InputForm: React.FC<InputFormProps> = ({
  action,
  amount,
  setAmount,
  connectedAddress,
  estimatedShares,
  handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-8 w-full">
      <IntegerInput
        value={amount}
        disableMultiplyBy1e18
        disabled={!connectedAddress}
        onChange={e => setAmount(e)}
        placeholder={`USDC amount to ${action}`}
      />
      <IntegerInput
        disabled
        disableMultiplyBy1e18
        value={estimatedShares}
        onChange={e => console.log(e)}
        placeholder={`Estimated FLH you ${action === "Deposit" ? "receive" : "burn"}`}
      />
      <button type="submit" disabled={!connectedAddress} className="btn rounded-xl btn-primary">
        {action}
      </button>
    </form>
  );
};

export default InputForm;
