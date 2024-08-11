"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const account = useAccount();
  return (
    <>
      {!account?.address ? (
        <div className="flex justify-center items-center flex-col">
          <h3 className="text-md mb-5">Connect your wallet to get started</h3>
          <ConnectButton />
        </div>
      ) : (
        <div className="flex justify-center items-start flex-col">
          <div className="flex w-full justify-between items-center">
            <ConnectButton />
          </div>

          {account?.address && (
            <div className="mt-10 flex justify-center items-between flex-col w-full">hELLO</div>
          )}
        </div>
      )}
    </>
  );
}
