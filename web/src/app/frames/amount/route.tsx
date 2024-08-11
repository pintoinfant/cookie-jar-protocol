import { Button } from "frames.js/next";
import { frames } from "../frames";
import { getProfileData } from "@/lib/getProfileData";
import { verifyOffchainAttestation } from "@/lib/verifyAttestation";
import { publicClient } from "@/utils/Client";
import { cookieJarContractAddress, cookieJarAbi } from "@/utils/const";

const handleRequest = frames(async (ctx) => {
  const hash = ctx.message?.inputText;
  const res = {
    hash: hash,
  };

  // const response = await fetch("http://localhost:3000/api/get-data-from-ipfs", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(res),
  // });
  // if (!response.ok) {
  //   throw new Error(`Error verifying Worldcoin: ${response.statusText}`);
  // }

  // const data = await response.json();
  // console.log(data);
  // const verified = await verifyOffchainAttestation(
  //   JSON.parse(JSON.parse(data.data))
  // );
  const data1 = await getProfileData(
    ctx.message?.requesterFid.toString() || ""
  );

  const jarData: any = await publicClient.readContract({
    address: cookieJarContractAddress(
      parseInt(ctx.searchParams["SourcechainId"])
    ),
    abi: cookieJarAbi,
    functionName: "jarIdToCookieJar",
    args: [ctx.searchParams["jarId"]],
  });
  const convertWeiToEth = (wei: string) => {
    return parseFloat(wei) / 10 ** 18;
  };
  const total = convertWeiToEth(jarData[4].toString());
  const userPercentage = 0.4; // Get this from governer contract
  const possibleWithdraw = total * userPercentage;

  console.log(JSON.stringify(ctx.message?.inputText, null, 2));
  if (true) {
    return {
      image: (
        <div
          tw="bg-black flex w-full h-full flex-col p-10 "
          style={{ gap: 100 }}
        >
          <div tw="flex justify-between items-center">
            <img
              src="http://localhost:3000/logo/cookie-header.png"
              alt=""
              height={100}
            />
            <div tw="flex justify-center items-center" style={{ gap: 20 }}>
              <div tw="text-white text-4xl" className=" text-5">
                {`@${data1.Socials.Social[0].profileName}`}
              </div>
            </div>
          </div>

          <div tw="flex flex-col gap-4" style={{ gap: 50 }}>
            <div tw="flex flex-col gap-4" style={{ gap: 10 }}>
              <div tw="flex text-white text-7xl items-center">
                <span>This jar has</span>
                <span tw="text-[#00D395] ml-2">{total}</span>
                <span tw="ml-2">ETH</span>
              </div>
              <div tw="flex text-white items-center text-4xl">
                <span>You are allowed to withdraw upto</span>
                <span tw="text-[#00D395] ml-2">{possibleWithdraw}</span>
                <span tw="ml-2">ETH</span>
              </div>
            </div>
            <div tw="text-white text-5xl">
              Please choose an amount to withdraw
            </div>
          </div>
        </div>
      ),
      buttons: [
        <Button
          action="post"
          target={`/chain?jarId=${ctx.searchParams["jarId"]}&SourcechainId=${
            ctx.searchParams["SourcechainId"]
          }&amount=${(possibleWithdraw / 4).toFixed(5)}`}
        >
          {`${(possibleWithdraw / 4).toFixed(5)}`}
        </Button>,
        <Button
          action="post"
          target={`/chain?jarId=${ctx.searchParams["jarId"]}&SourcechainId=${
            ctx.searchParams["SourcechainId"]
          }&amount=${(possibleWithdraw / 2).toFixed(5)}`}
        >
          {`${(possibleWithdraw / 2).toFixed(5)}`}
        </Button>,
        <Button
          action="post"
          target={`/chain?jarId=${ctx.searchParams["jarId"]}&SourcechainId=${
            ctx.searchParams["SourcechainId"]
          }&amount=${((possibleWithdraw / 4) * 3).toFixed(5)}`}
        >
          {`${((possibleWithdraw / 4) * 3).toFixed(5)}`}
        </Button>,
        <Button
          action="post"
          target={`/chain?jarId=${ctx.searchParams["jarId"]}&SourcechainId=${ctx.searchParams["SourcechainId"]}&amount=${possibleWithdraw}`}
        >
          {`${possibleWithdraw}`}
        </Button>,
      ],
    };
  } else {
    return {
      image: (
        <div
          tw="bg-black flex w-full h-full justify-center items-center"
          className=" items-center"
        >
          <div tw="text-white">Unable to verify you are Human. Retry again</div>
        </div>
      ),
      buttons: [
        <Button action="post_redirect" target="cookie-jar/verify">
          Verify
        </Button>,
      ],
    };
  }
});

export const GET = handleRequest;
export const POST = handleRequest;
