import { Button } from "frames.js/next";
import { frames } from "../frames";

const handleRequest = frames(async (ctx) => {
  const verified = true;
  if (verified) {
    return {
      image: (
        <div
          tw="bg-black flex w-full h-full justify-center items-center"
          className=" items-center"
        >
          <div tw="text-white">Amount</div>
        </div>
      ),
      buttons: [
        <Button action="post" target="/note?amount=25">
          25%
        </Button>,
        <Button action="post" target="/note?amount=50">
          50%
        </Button>,
        <Button action="post" target="/note?amount=75">
          75%
        </Button>,
        <Button action="post" target="/note?amount=100">
          100%
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
