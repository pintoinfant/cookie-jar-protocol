import { Button } from "frames.js/next";
import { frames } from "../frames";
import { getProfileData } from "@/lib/getProfileData";

const handleRequest = frames(async (ctx) => {
  const verified = true;
  const data = await getProfileData(ctx.message?.requesterFid.toString() || "");
  const total = 100;
  const possibleWithdraw = 12;
  if (verified) {
    return {
      image: (
        <div
          tw="bg-black flex w-full h-full flex-col p-10 "
          style={{ gap: 100 }}
        >
          <div tw="flex justify-between items-center">
            <img
              src="https://cd9c-49-205-84-30.ngrok-free.app/logo/cookie-header.png"
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
                <span tw="text-[#00D395] ml-2">{total}</span>
                <span tw="ml-2">USDC</span>
              </div>
              <div tw="flex text-white items-center text-4xl">
                <span>You are allowed to withdraw upto</span>
                <span tw="text-[#00D395] ml-2">{possibleWithdraw}</span>
                <span tw="ml-2">USDC</span>
              </div>
            </div>
            <div tw="text-white text-5xl">
              Please choose an amount to withdraw
            </div>
          </div>
        </div>
      ),
      buttons: [
        <Button action="post" target={`/chain?amount=${possibleWithdraw / 4}`}>
          {`${possibleWithdraw / 4}`}
        </Button>,
        <Button action="post" target={`/chain?amount=${possibleWithdraw / 2}`}>
          {`${possibleWithdraw / 2}`}
        </Button>,
        <Button
          action="post"
          target={`/chain?amount=${(possibleWithdraw / 4) * 3}`}
        >
          {`${(possibleWithdraw / 4) * 3}`}
        </Button>,
        <Button action="post" target={`/chain?amount=${possibleWithdraw}`}>
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
