import { Button } from "frames.js/next";
import { frames } from "../frames";

import { getProfileData } from "@/lib/getProfileData";
import { publicClient } from "@/utils/Client";
import { cookieJarContractAddress, cookieJarAbi } from "@/utils/const";

const handleRequest = frames(async (ctx) => {
  console.log(JSON.stringify(ctx, null, 2));
  const data = await getProfileData(ctx.message?.requesterFid.toString() || "");
  const jarData: any = await publicClient.readContract({
    address: cookieJarContractAddress(
      parseInt(ctx.searchParams["SourcechainId"])
    ),
    abi: cookieJarAbi,
    functionName: "jarIdToCookieJar",
    args: [ctx.searchParams["jarId"]],
  });
  console.log(jarData);

  const convertWeiToEth = (wei: string) => {
    return parseFloat(wei) / 10 ** 18;
  };
  const userPercentage = 0.4; // Get this from governer contract

  return {
    image: (
      <div tw="bg-black flex w-full h-full flex-col p-10 " style={{ gap: 100 }}>
        <div tw="flex justify-between items-center">
          <img
            src="http://localhost:3000/logo/cookie-header.png"
            alt=""
            height={100}
          />
          <div tw="flex justify-center items-center" style={{ gap: 20 }}>
            <div tw="text-white text-4xl" className=" text-5">
              {`@${data.Socials.Social[0].profileName}`}
            </div>
          </div>
        </div>

        <div tw="flex flex-col gap-4" style={{ gap: 50 }}>
          <div tw="flex flex-col gap-4" style={{ gap: 10 }}>
            <div tw="flex text-white text-7xl items-center">
              <span>This jar has</span>
              <span tw="text-[#00D395] ml-2">
                {convertWeiToEth(jarData[4].toString())}
              </span>
              <span tw="ml-2">ETH</span>
            </div>
            <div tw="flex text-white items-center text-4xl">
              <span>You are allowed to withdraw upto</span>
              <span tw="text-[#00D395] ml-2">
                {convertWeiToEth(jarData[4].toString()) * userPercentage}
              </span>
              <span tw="ml-2">ETH</span>
            </div>
          </div>
          <div tw="text-white text-4xl">
            *this is based on your voting power :)
          </div>
        </div>
      </div>
    ),
    buttons: [
      <Button
        action="post"
        target={`/worldcoin?jarId=${ctx.searchParams["jarId"]}&SourcechainId=${ctx.searchParams["SourcechainId"]}`}
      >
        Verify with Worldcoin
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
