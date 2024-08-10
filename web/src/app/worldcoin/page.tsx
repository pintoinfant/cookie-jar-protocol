"use client";

import { VerificationLevel, IDKitWidget, useIDKit } from "@worldcoin/idkit";
import type { ISuccessResult } from "@worldcoin/idkit";
// import { verify } from "./actions/verify";
// import axios from "axios";

export default function Page() {
  const app_id = "app_76926e49e7e353006d577f8839a63d5e";
  const action = "cookie-jar-prod";

  if (!app_id) {
    throw new Error("app_id is not set in environment variables!");
  }
  if (!action) {
    throw new Error("action is not set in environment variables!");
  }

  const onSuccess = (result: ISuccessResult) => {
    // This is where you should perform frontend actions once a user has been verified, such as redirecting to a new page
    console.log({ result: result });
    // window.alert(
    //   "Successfully verified with World ID! Your nullifier hash is: " +
    //     result.nullifier_hash
    // );
    console.log(encodeURI(JSON.stringify(result)));
    console.log(decodeURI(encodeURI(JSON.stringify(result))));
  };

  const handleVerify = async (proof: any) => {
    console.log({ verify: proof });
    const response = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proof }),
    });
    if (!response.ok) {
      throw new Error(`Error verifying Worldcoin: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);
  };
  return (
    <div>
      <div className="flex flex-col items-center justify-center align-middle h-screen">
        <p className="text-2xl mb-5">World ID Cloud Template</p>
        <IDKitWidget
          action={action}
          app_id={app_id}
          onSuccess={onSuccess}
          handleVerify={handleVerify}
          verification_level={VerificationLevel.Device}
        >
          {({ open }) => (
            <div
              className="font-bold text-lg pt-1 text-zinc-600 cursor-pointer"
              onClick={open}
            >
              World ID Login
            </div>
          )}
        </IDKitWidget>
      </div>
    </div>
  );
}
