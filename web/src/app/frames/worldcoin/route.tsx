import { Button } from "frames.js/next";
import { frames } from "../frames";

const handleRequest = frames(async (ctx) => {
  return {
    image: (
      <div
        tw="bg-black flex w-full h-full justify-center items-center"
        className=" items-center"
      >
        <div tw="text-white">World Coin verification</div>
      </div>
    ),
    textInput: "Enter the Nullifier ",
    buttons: [
      <Button action="post" target="/amount">
        Verify with worldcoin
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
