import { Button } from "frames.js/next";
import { frames } from "../frames";
import jar from "../../../public/logo/money-jar.png";
import { getProfileData } from "@/lib/getProfileData";

const handleRequest = frames(async (ctx) => {
  console.log(JSON.stringify(ctx, null, 2));
  const data = await getProfileData(ctx.message?.requesterFid.toString() || "");

  return {
    image: (
      <div tw="bg-black flex w-full h-full flex-col p-10 " style={{ gap: 80 }}>
        <div tw="flex justify-between items-center">
          <img
            src="http://localhost:3000/logo/header.png"
            alt=""
            height={100}
          />
          <div tw="flex justify-center items-center" style={{ gap: 20 }}>
            <img
              src={data.Socials.Social[0].profileImage}
              alt=""
              height={100}
              width={100}
              style={{ borderRadius: 50 }}
            />
            <div tw="text-white text-5xl" className=" text-5">
              {`@${data.Socials.Social[0].profileName}`}
            </div>
          </div>
        </div>

        <div tw="flex flex-col gap-4" style={{ gap: 40 }}>
          <div tw="flex text-white text-7xl items-center">
            <span>This jar has</span>
            <span tw="text-[#00D395] ml-2">100</span>
            <span tw="ml-2">USDC</span>
          </div>
          <div tw="flex text-white text-5xl items-center">
            <span>You are allowed to withdraw upto</span>
            <span tw="text-[#00D395] ml-2">12</span>
            <span tw="ml-2">USDC</span>
          </div>
          <div tw="text-white">*this is based on your voting power :)</div>
        </div>
      </div>
    ),
    buttons: [
      <Button action="post" target="/worldcoin">
        Verify with WorldId
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
