import { Button } from "frames.js/next";
import { frames } from "../frames";

import { getProfileData } from "@/lib/getProfileData";

const handleRequest = frames(async (ctx) => {
  console.log(JSON.stringify(ctx.walletAddress, null, 2));
  const data = await getProfileData(ctx.message?.requesterFid.toString() || "");

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
          <div tw="flex text-white text-5xl items-center">
            <span>Where do you want to </span>
            <span tw="text-[#00D395] ml-2">withdraw ?</span>
          </div>
        </div>
      </div>
    ),
    buttons: [
      <Button
        action="post"
        target={`/note?jarId=${ctx.searchParams["jarId"]}&SourcechainId=${ctx.searchParams["SourcechainId"]}&amount=${ctx.searchParams["amount"]}&chain=op`}
      >
        Optimism
      </Button>,
      <Button
        action="post"
        target={`/note?jarId=${ctx.searchParams["jarId"]}&SourcechainId=${ctx.searchParams["SourcechainId"]}&amount=${ctx.searchParams["amount"]}&chain=base`}
      >
        Base
      </Button>,
      <Button
        action="post"
        target={`/note?jarId=${ctx.searchParams["jarId"]}&SourcechainId=${ctx.searchParams["SourcechainId"]}&amount=${ctx.searchParams["amount"]}&chain=celo`}
      >
        Celo
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
