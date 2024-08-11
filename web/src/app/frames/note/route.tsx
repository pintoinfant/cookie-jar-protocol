import { Button } from "frames.js/next";
import { frames } from "../frames";
import { getProfileData } from "@/lib/getProfileData";

const handleRequest = frames(async (ctx) => {
  const data = await getProfileData(ctx.message?.requesterFid.toString() || "");

  return {
    image: (
      <div tw="bg-black flex w-full h-full flex-col p-10 " style={{ gap: 70 }}>
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
            <span>Leave a </span>
            <span tw="text-[#00D395] ml-2">note!</span>
          </div>
          <div tw="text-white text-4xl">(Eg:Purchased Devcon Ticket)</div>
        </div>

        <div
          tw="flex justify-end text-white items-center"
          style={{
            gap: 20,
          }}
        >
          <div tw="text-5xl">via</div>
          <img
            src="http://localhost:3000/logo/eas-white.png"
            alt=""
            height={150}
          />
        </div>
      </div>
    ),
    textInput: "Enter the Note",
    buttons: [
      <Button
        action="tx"
        target={`/withdraw?amount=${ctx.searchParams["amount"]}&chain=${ctx.searchParams["chain"]}&jarId=${ctx.searchParams["jarId"]}`}
      >
        withdraw
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
