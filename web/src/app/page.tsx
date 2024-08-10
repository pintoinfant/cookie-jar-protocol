import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { fetchMetadata } from "frames.js/next";
export async function generateMetadata() {
  return {
    title: "My Page",
    // provide a full URL to your /frames endpoint
    other: await fetchMetadata(
      new URL(
        "/frames",
        process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000"
      )
    ),
  };
}

export default function Home() {
  const account = useAccount();

  return (
    <main className="container flex min-h-screen flex-col items-center justify-center p-10">
      <div className="absolute top-5 right-5">
        <ModeToggle />
      </div>
      <div className="relative flex place-items-center">
        <Image
          className="relative mr-10"
          src="/giphy.gif"
          alt="Karma Logo"
          width={180}
          height={180}
          priority
        />
        <div className="mr-10">
          <div className="text-3xl font-bold">some app</div>
          <div className="text-lg ">this app does something</div>
        </div>
      </div>

      <section className="lg:max-w-5xl lg:w-full ">
        <div className="ring-1 ring-zinc-700 rounded-xl p-8 w-full">
          {!account?.address ? (
            <div className="flex justify-center items-center flex-col">
              <h3 className="text-md mb-5">
                Connect your wallet to get started
              </h3>
              <ConnectButton />
            </div>
          ) : (
            <div className="flex justify-center items-start flex-col">
              <div className="flex w-full justify-between items-center">
                <ConnectButton />
              </div>

              {account?.address && (
                <div className="mt-10 flex justify-center items-between flex-col w-full"></div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
