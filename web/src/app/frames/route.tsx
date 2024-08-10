import { Button } from "frames.js/next";
import { frames } from "./frames";

const handleRequest = frames(async (ctx) => {
  return {
    image: (
      <div
        tw="bg-black flex w-full h-full flex-col"
        style={{
          gap: 20,
        }}
      >
        <div tw="flex flex-col gap-2 px-16 py-16">
          <img
            src="https://cd9c-49-205-84-30.ngrok-free.app/logo/header.png"
            alt="Cookie Jar"
            height={200}
          />
          <div tw="text-white text-7xl">/ compound-dao</div>
        </div>
        <div tw="flex justify-end mt-[-205] mr-[30]">
          <img
            src="https://cd9c-49-205-84-30.ngrok-free.app/logo/cookie.png"
            alt="Cookie Jar"
            height={350}
          />
        </div>
      </div>
    ),
    buttons: [
      <Button action="post" target="/profile">
        Get Started
      </Button>,
      <Button
        action="post_redirect"
        target="https://cd9c-49-205-84-30.ngrok-free.app"
      >
        Create your Jar
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
