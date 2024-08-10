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
        <div tw="text-white">{`Enter The note for your amount ${percentage}`}</div>
      </div>
    ),
    textInput: "Enter the Note",
    buttons: [
      <Button action="post" target={`/withdraw?amount=${percentage}`}>
        Attest
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
