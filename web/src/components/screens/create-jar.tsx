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
    const [daoTokenAddress, setDaoTokenAddress] = useState('');
    const [daoGovernorAddress, setDaoGovernorAddress] = useState('');
    const [ethAmount, setEthAmount] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { writeContract, isPending: isLoading } = useWriteContract();
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
        let jarId = response.data.data.jarCreateds[0]?.jarId || "0xde991ad4fec493c8213aba5fd6da8659e31925c5431efcba4d7e63c816d6a31e";
        return `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/frames?jarId=${jarId}&chainId=${chainId}`;
    }

    function FrameURLComponent() {
        const [frameUrl, setFrameUrl] = useState('');
        useEffect(() => {
            getFrameUrl().then((url) => {
                setFrameUrl(url);
            });
        }, []);

        return (
            <div>
                {frameUrl &&
                    <p>
                        {frameUrl}
                    </p>
                }
            </div>
        );
    }


    const handleCreateJar = () => {
        if (daoTokenAddress && daoGovernorAddress && ethAmount) {
            console.log('Creating Jar...', contractAbi, contractAddress);
            writeContract({
                abi: contractAbi,
                address: contractAddress as any,
                functionName: 'createJar',
                args: [
                    daoTokenAddress,
                    daoGovernorAddress,
                    ethAmount ? parseEther(ethAmount) : undefined
                ] as any,
            })
        } else {
            console.log('Please fill in all fields.');
            setError('Please fill in all fields.');
        }
    };

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
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-emerald-500 mb-4">{success}</p>}

            {success && <FrameURLComponent />}
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
