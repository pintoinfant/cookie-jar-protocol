import { fetchMetadata } from "frames.js/next";
import Home from "@/components/screens/home";

export async function generateMetadata() {
  return {
    title: "My Page",
    // provide a full URL to your /frames endpoint
    other: await fetchMetadata(
      new URL(
        "/frames?jarId=0x841b499a67278540191ded9a7718abfc53f38b150b34c1b9bec50a5974a7958f&SourcechainId=84532",
        process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000"
      )
    ),
  };
}

export default function Index() {
  return (
    <>
      <Home />
    </>
  );
}
