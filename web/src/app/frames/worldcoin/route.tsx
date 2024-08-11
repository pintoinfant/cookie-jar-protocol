import { Button } from "frames.js/next";
import { frames } from "../frames";
import { getProfileData } from "@/lib/getProfileData";

const handleRequest = frames(async (ctx) => {
  const data = await getProfileData(ctx.message?.requesterFid.toString() || "");

  return {
    image: (
      <div tw="bg-black flex w-full h-full flex-col p-10 " style={{ gap: 80 }}>
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

        <div tw="flex flex-col gap-4" style={{ gap: 40 }}>
          <img
            src="http://localhost:3000/logo/Worldcoin_Logo.png"
            alt=""
            // width={525}
            height={200}
            style={{
              filter: "invert(100%)",
              marginLeft: -63,
            }}
          />
          <div tw="flex text-white text-4xl items-center">
            <span>Our</span>
            <span tw="text-[#00D395] ml-2">trusted</span>
            <span tw="ml-2">backend will check if you are human :)</span>
          </div>
        </div>
      </div>
    ),
    textInput: "Enter the Nullifier ",
    buttons: [
      <Button action="link" target="http://localhost:3000/worldcoin">
        Get your proof here
      </Button>,
      <Button
        action="post"
        target={`/amount?jarId=${ctx.searchParams["jarId"]}&SourcechainId=${ctx.searchParams["SourcechainId"]}`}
      >
        Verify with worldcoin
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
