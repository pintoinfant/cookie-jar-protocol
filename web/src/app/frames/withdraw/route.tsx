import { Button } from "frames.js/next";
import { frames } from "../frames";

const handleRequest = frames(async (ctx) => {
  const percentage = ctx.searchParams["amount"];
  return {
    image: (
      <div
        tw="bg-black flex w-full h-full justify-center items-center"
        className=" items-center"
      >
        <div tw="text-white">{`Do you want to withdraw ${percentage} % of your share`}</div>
      </div>
    ),
    buttons: [
      <Button action="post" target="/amount">
        Go back
      </Button>,
      <Button action="tx" target="/worldcoin">
        Withdraw
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
