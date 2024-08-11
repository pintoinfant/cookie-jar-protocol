"use client";
import Notes from "@/components/screens/notes";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

const schemaDictionary: {[key: number] : { noteSchema: string, upVote: string, graphQL: string, jairID: string, easContract: string }} = {
  11155420: {
    noteSchema: "0x99f9fd4bdbcb8bc87353725f28afbbfb4299b6ad0c67471077e089d8e4c6f25d",
    upVote: "0x761a985431e4d67486c6595e4a5c220fc99e84f76d9525ee3e8f776580894ccd",
    graphQL: "https://optimism-sepolia-bedrock.easscan.org/graphql",
    jairID: "0xde991ad4fec493c8213aba5fd6da8659e31925c5431efcba4d7e63c816d6a31e",
    easContract: "0x4200000000000000000000000000000000000021"
  },
  84532: {
    noteSchema: "0x99f9fd4bdbcb8bc87353725f28afbbfb4299b6ad0c67471077e089d8e4c6f25d",
    upVote: "0x761a985431e4d67486c6595e4a5c220fc99e84f76d9525ee3e8f776580894ccd",
    graphQL: "https://base-sepolia.easscan.org/graphql",
    jairID: "0xde881ad4fec493c8213aba5fd6da8659e31925c5431efcba4d7e63c816d6a42a",
    easContract: "0x4200000000000000000000000000000000000021"
  }
};

export default function Page() {
  const [notes, setNotes] = useState<any[]>([]);

  function parseJson(data: any) {
    try {
      if (data?.json && typeof data.json === "string") {
        return parseJson(JSON.parse(data.json));
      }
      if (typeof data?.json === "object") {
        return data.json;
      }
      return data;
    } catch {
      console.error("Error parsing JSON", data);
      return {};
    }
  }
  
  function getJson(datas: any[]) {
    return datas.reduce((acc, cur) => {
      acc[cur.value.name] = cur.value.value;
      return acc;
    }, {});
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const chainId = urlParams.get("chainId");
    const fetchNotes = async () => {
      if (typeof window !== "undefined") {
        // get chainId and jairId from the URL

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

            const attestationsUIDS = await response.json();
            console.log({attestationsUIDS})
            if (attestationsUIDS.length > 0) {
              await window.ethereum.request({ method: 'eth_requestAccounts' });                
              const provider = new ethers.BrowserProvider(window.ethereum);

              const network = await provider.getNetwork();
            
              if (BigInt(network.chainId) !== BigInt(chainId)) {
                alert('Please switch to the Optimism Sepolia network.');
                await window.ethereum.request({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId: ethers.toBeHex(chainId) }],
                });
              }
            
              const signer = await provider.getSigner();
              const eas = new EAS(schemaDictionary[+chainId].easContract);
              eas.connect(signer);
              const encoder = new SchemaEncoder("string note,bytes32 jarId,uint256 amount");

              const allNotes = []
              for (const uid of attestationsUIDS) {
                try{
                  const attestation = await eas.getAttestation(uid.id);
                  const data = parseJson(getJson(encoder.decodeData(attestation.data)));
                  allNotes.push({
                    uid: uid.id,
                    amount: Number(data.amount) / 10 ** 10,
                    note: data.note,
                    jarId: data.jarId,
                    upvotes: 0,
                    downvotes: 0,
                  });
               }catch(err){}
              }

              if (allNotes.length > 0) {
                setNotes(allNotes);
              }
            }

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
      <Notes allNotes={notes} />
    </div>
  );
}
