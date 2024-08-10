import Image from "next/image";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { fetchMetadata } from "frames.js/next";
import Home from "@/components/screens/home";
import ResultCard from "@/components/ui/ResultCard";

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

const dummyData = [
  {
    description: 'I hosted a community call this week - had to buy discord nitro for the server',
    amount: '12',
    upvotes: 10,
    downvotes: 2,
    uid: '0x5815d7106c7126cf4823da14813462d3c2d0630ea86c1608dc3ba5353c44f2c5'
  },
  {
    description: 'I hosted a community call this week - had to buy discord nitro for the server',
    amount: '12',
    upvotes: 10,
    downvotes: 2,
    uid: '0x5815d7106c7126cf4823da14813462d3c2d0630ea86c1608dc3ba5353c44f2c5'
  },
  {
    description: 'I hosted a community call this week - had to buy discord nitro for the server',
    amount: '12',
    upvotes: 10,
    downvotes: 2,
    uid: '0x5815d7106c7126cf4823da14813462d3c2d0630ea86c1608dc3ba5353c44f2c5'
  },
  {
    description: 'I hosted a community call this week - had to buy discord nitro for the server',
    amount: '12',
    upvotes: 10,
    downvotes: 2,
    uid: '0x5815d7106c7126cf4823da14813462d3c2d0630ea86c1608dc3ba5353c44f2c5'
  },
  // Add more data here
];

export default function Index() {
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      backgroundColor: '#f8f9fa', 
      fontFamily: 'Patrick Hand'
    }}>
      <div style={{ 
        padding: '20px', 
        maxWidth: '1000px', 
        width: '100%', 
        margin: '0 auto', 
        backgroundColor: '#ffffff', 
        borderRadius: '12px', 
        boxShadow: '0 0 20px rgba(0,0,0,0.1)', 
        overflow: 'hidden' 
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          fontSize: '24px', 
          marginBottom: '20px', 
          color: '#333', 
          textTransform: 'lowercase',
        }}>
          cookiejar/compound-dao
        </h1>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', // Increased card width
          gap: '20px' 
        }}>
          {dummyData.map((item, index) => (
            <ResultCard
              key={index}
              description={item.description}
              amount={item.amount}
              upvotes={item.upvotes}
              downvotes={item.downvotes}
              uid={item.uid}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
