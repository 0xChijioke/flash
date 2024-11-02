"use client";

import { useContext } from "react";
import Metrics from "~~/components/vault/Metrics";
import VaultTerminal from "~~/components/vault/VaultTerminal";
import { ClientContext } from "~~/contexts/ClientContext";

const Home = () => {
  const walletClient = useContext(ClientContext);

  return (
    <div className="w-full m-auto flex flex-col justify-center items-center h-full">
      <div>
        <Metrics />
      </div>
      <div className="lg:w-[60%] mt-14">
        <VaultTerminal />
      </div>
      <div></div>
    </div>
  );
};

export default Home;
