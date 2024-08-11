import Providers from "@/components/Providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import Image from "next/image";
import { ModeToggle } from "@/components/ui/mode-toggle";
import Link from "next/link";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Some App",
  description: "This app does something",
  icons: ["/logo/logo-dark.png"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} dark:bg-black`}>
        <Providers>
          <main className="container flex min-h-screen flex-col items-center justify-center p-10">
            <div className="absolute top-5 right-5 flex justify-center items-center">
              <div className="flex text-emerald-400 mr-3">
                <Link className="mr-4" href={"/create-jar"}>
                  /create-jar
                </Link>
                <Link href={"/notes"}>/notes</Link>
              </div>
              <div className="flex justify-center items-center mr-5">
                <ConnectButton />
              </div>
              <ModeToggle />
            </div>
            <div className="relative flex place-items-center">
              <Link href="/">
                <Image
                  className="relative mr-2"
                  src="/logo/cookie.png"
                  alt="Cookie Jar Logo"
                  width={180}
                  height={180}
                  priority
                />
              </Link>
              <div className="mr-10">
                <div className="text-3xl font-bold">
                  <Image
                    className="relative -ml-3"
                    src="/logo/cookie-header.png"
                    alt="Cookie Jar Logo"
                    width={300}
                    height={300}
                    priority
                  />
                </div>
                <div className="text-lg ">no DAO overhead for petty cash</div>
              </div>
            </div>

            <section className="lg:max-w-5xl lg:w-full ">
              <div className="ring-1 ring-zinc-700 rounded-xl p-8 w-full">
                {children}
              </div>
            </section>
          </main>
        </Providers>
      </body>
    </html>
  );
}
