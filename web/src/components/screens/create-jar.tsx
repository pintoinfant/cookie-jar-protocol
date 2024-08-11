'use client';

import React, { useState, useEffect } from 'react';
import { useWriteContract } from 'wagmi';
import { parseEther } from 'viem';
import { useChainId, useAccount } from 'wagmi';
import { cookieJarSubgraphUrl } from "@/utils/const";
import axios from 'axios';


type Props = {
    contractAddress: string;
    contractAbi: any;
};

const CreateJarComponent = ({ contractAddress, contractAbi }: Props) => {
    const [daoTokenAddress, setDaoTokenAddress] = useState('0x4359Eba4c70eb4B517Cd61c02C8ad5bff077916D');
    const [daoGovernorAddress, setDaoGovernorAddress] = useState('0x3B0C03e82c60AF5D16f3419d969d80D3Ed4E0de2');
    const [ethAmount, setEthAmount] = useState('0.0001');


    const { writeContract, isPending: isLoading, error: txError, isSuccess } = useWriteContract();
    const chainId = useChainId();
    const account = useAccount();

    async function getFrameUrl() {
        let goldsky = cookieJarSubgraphUrl(chainId);
        let query = `query JarCreateds {
            jarCreateds(
                first: 10
                orderBy: timestamp_
                orderDirection: desc
            ) {
                id
                block_number
                timestamp_
                transactionHash_
                contractId_
                jarId
            }
        }
        `;

        let response = await axios.post(goldsky, { query });
        console.log('response from jar creation', response.data);
        let jarId = response.data.data.jarCreateds[0]?.jarId || "0xde991ad4fec493c8213aba5fd6da8659e31925c5431efcba4d7e63c816d6a31e";
        // return `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/frames?jarId=${jarId}&chainId=${chainId}`;
        return `https://cookie-jar-protocol.vercel.app/frames?jarId=${jarId}&chainId=${chainId}`;
    }

    function FrameURLComponent() {
        const [frameUrl, setFrameUrl] = useState('');
        useEffect(() => {
            getFrameUrl().then((url) => {
                setFrameUrl(url);
            });
        }, []);

        return (
            <div className='mb-3 w-full'>
                <h1 className='font-bold mb-2 text-xl '>Here goes cookie jar frame link</h1>
                {frameUrl &&
                    <p className='text-balance bg-zinc-600 rounded-md p-2 overflow-x-scroll'>
                        {frameUrl}
                    </p>
                }
            </div>
        );
    }


    const handleCreateJar = () => {
        if (daoTokenAddress && daoGovernorAddress && ethAmount) {
            console.log('Creating Jar...', contractAbi, contractAddress);
            const hash = writeContract({
                abi: contractAbi,
                address: contractAddress as any,
                functionName: 'createJar',
                args: [
                    daoTokenAddress,
                    daoGovernorAddress,
                ] as any,
                value: parseEther(ethAmount),
            })
            console.log('Jar created with hash', hash)

        } else {
            console.log('Please fill in all fields.');
        }
    };

    useEffect(() => {
        console.log('txError', txError);
    }, [txError]);

    return (
        <div className="max-w-lg mx-auto p-6 bg-zinc-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Create New Jar</h2>
            <div className="mb-4">
                <label className="block text-gray-200 text-sm font-bold mb-2">
                    DAO Token Address
                </label>
                <input
                    type="text"
                    className="w-full p-3 border rounded"
                    value={daoTokenAddress}
                    onChange={(e) => setDaoTokenAddress(e.target.value)}
                    placeholder="0x..."
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-200 text-sm font-bold mb-2">
                    DAO Governor Address
                </label>
                <input
                    type="text"
                    className="w-full p-3 border rounded"
                    value={daoGovernorAddress}
                    onChange={(e) => setDaoGovernorAddress(e.target.value)}
                    placeholder="0x..."
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-200 text-sm font-bold mb-2">
                    Deposit Amount (ETH)
                </label>
                <input
                    type="number"
                    className="w-full p-3 border rounded"
                    value={ethAmount}
                    onChange={(e) => setEthAmount(e.target.value)}
                    placeholder="0.1"
                />
            </div>
            {txError && <p className="text-red-500 mb-4">{txError.message}</p>}
            {isSuccess && <p className="text-emerald-500 mb-4">
                Tx successful</p>}

            {isSuccess && <FrameURLComponent />}
            <button
                onClick={handleCreateJar}
                className={`w-full p-3 bg-emerald-500 text-black font-bold rounded ${isLoading ? 'opacity-50' : ''}`}
                disabled={!daoTokenAddress && !daoGovernorAddress && !ethAmount && !account?.address}
            >
                {isLoading ? 'Creating Jar...' : 'Create Jar'}
            </button>
        </div>
    );
};

export default CreateJarComponent;
