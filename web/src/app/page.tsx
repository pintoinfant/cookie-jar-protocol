import Image from "next/image";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { fetchMetadata } from "frames.js/next";
import Home from "@/components/screens/home";

export async function generateMetadata() {
  return {
    title: "My Page",
    // provide a full URL to your /frames endpoint
    other: await fetchMetadata(
      new URL(
        "/frames",
        process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000"
      )
    ),
  };
}

export default function Index() {

  return (
    <main className="container flex min-h-screen flex-col items-center justify-center p-10">
      <div className="absolute top-5 right-5">
        <ModeToggle />
      </div>
      <div className="relative flex place-items-center">
        <Image
          className="relative mr-10"
          src="/giphy.gif"
          alt="Karma Logo"
          width={180}
          height={180}
          priority
        />
        <div className="mr-10">
          <div className="text-3xl font-bold">some app</div>
          <div className="text-lg ">this app does something</div>
        </div>
      </div>

      <section className="lg:max-w-5xl lg:w-full ">
        <div className="ring-1 ring-zinc-700 rounded-xl p-8 w-full">
          <Home />
        </div>
      </section>
    </main>
  );
}
