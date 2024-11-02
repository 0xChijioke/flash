import { createContext, useEffect, useState } from "react";
import { useWalletClient } from "wagmi";

export const ClientContext = createContext(null);

export const ClientProvider = ({ children }: { children: any }) => {
  const { data: client, status } = useWalletClient();
  const [walletClient, setWalletClient] = useState<any>(null);

  useEffect(() => {
    if (status === "success" && client) {
      setWalletClient(client);
    }
  }, [status, client]);

  // console.log(walletClient)

  return <ClientContext.Provider value={walletClient}>{children}</ClientContext.Provider>;
};
