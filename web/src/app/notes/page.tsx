"use client";
import Notes from "@/components/screens/notes";
import { useEffect } from "react";

// Rename this dictionary to avoid name conflicts
const schemaDictionary: {[key: number] : { noteSchema: string, upVote: string, graphQL: string, jairID: string }} = {
  11155420: {
    noteSchema: "0x99f9fd4bdbcb8bc87353725f28afbbfb4299b6ad0c67471077e089d8e4c6f25d",
    upVote: "0x761a985431e4d67486c6595e4a5c220fc99e84f76d9525ee3e8f776580894ccd",
    graphQL: "https://optimism-sepolia-bedrock.easscan.org/graphql",
    jairID: "0xde991ad4fec493c8213aba5fd6da8659e31925c5431efcba4d7e63c816d6a31e"
  },
  84532: {
    noteSchema: "0x99f9fd4bdbcb8bc87353725f28afbbfb4299b6ad0c67471077e089d8e4c6f25d",
    upVote: "0x761a985431e4d67486c6595e4a5c220fc99e84f76d9525ee3e8f776580894ccd",
    graphQL: "https://base-sepolia.easscan.org/graphql",
    jairID: "0xde881ad4fec493c8213aba5fd6da8659e31925c5431efcba4d7e63c816d6a42a"
  }
};

export default function Page() {
    useEffect(() => {
      const fetchNotes = async () => {
        if (typeof window !== "undefined") {
          // get chainId and jairId from the URL
          const urlParams = new URLSearchParams(window.location.search);
          const chainId = urlParams.get("chainId");
            console.log('chainId:', chainId);
          if (chainId !== null && schemaDictionary[+chainId]) {
            try {
              const response = await fetch('/api/notes', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  url: schemaDictionary[+chainId].graphQL,
                  schemaId: schemaDictionary[+chainId].noteSchema,
                  jairId: schemaDictionary[+chainId].jairID,
                }),
              });
  
              const data = await response.json();
            } catch (error) {
              console.error('Error fetching notes:', error);
            }
          }
        }
      };
  
      fetchNotes();
    }, []);
  
    return (
      <div className="ring-1 ring-zinc-700 rounded-xl p-8 w-full">
        <Notes />
      </div>
    );
  }
