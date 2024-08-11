// export const dynamic = "force-dynamic"; // defaults to auto
import { NextResponse } from "next/server";
import { ethers } from "ethers";
import { optimismSepolia, celoAlfajores, baseSepolia, modeTestnet, celo } from "viem/chains"
import * as abi from "../../../../../goldsky/abi.json"


const completeCCWithdrawal = async (jarId: string, amount: string, note: string, sender: string, chainId: string, sourceChainId: string) => {
    let rpcUrl = ''
    let address = ''
    const OP_CONTRACT = '0xA0b3Fa18a089F8bff398Fe8B83B8aC97DFF90548'
    const BASE_CONTRACT = '0x0810b2d3c23d7207c6b15fb6b3303e99561cb80f'

    if (Number(chainId) == optimismSepolia.id) {
        rpcUrl = optimismSepolia.rpcUrls.default.http[0] as string
        address = OP_CONTRACT
    }
    if (Number(chainId) == modeTestnet.id) {
        rpcUrl == modeTestnet.rpcUrls.default.http[0] as string
    }
    if (Number(chainId) == celoAlfajores.id) {
        rpcUrl == celoAlfajores.rpcUrls.default.http[0] as string
    }
    if (Number(chainId) == baseSepolia.id) {
        rpcUrl == baseSepolia.rpcUrls.default.http[0] as string
        address = BASE_CONTRACT
    }
    const provider = new ethers.JsonRpcProvider(rpcUrl)
    const contract = new ethers.Contract(address, abi, provider)
    const data = [
        sender, // _requester
        amount, // _amount
        sourceChainId, // _sourceChainId
        chainId, // _targetChainId
        sender, // _jarOwner
        amount, // _jarBalance
        jarId, // _jarId
        0, // _noOfWithdrawals
        "0x5a2C204b10f7971A3c657e90d0748cfec2b24453", // _daoGovernorAddress
        "0xf960c68a7D7BA3a4394134838f625c20c1dc2977", // _daoTokenAddress
        [] // _withdrawals (empty array)
    ]
    await contract.completeCCWithdrawal(data)
}

export async function POST(request: Request) {
    const req = await request.json();
    const url = request.url
    let sourceChainId;
    if (url == "https://api.goldsky.com/api/public/project_clzphgane7fmt01v37dcxbj7t/subgraphs/cookiejar-optimism-sepolia/1.0.0/gn") {
        sourceChainId == optimismSepolia.id
    }
    if (url == "https://api.goldsky.com/api/public/project_clzphgane7fmt01v37dcxbj7t/subgraphs/cookiejar-base-sepolia/1.0.0/gn") {
        sourceChainId == baseSepolia.id
    }
    const { jarId, amount, note, requester, chainId } = req;
    try {
        await completeCCWithdrawal(jarId, amount, note, requester, chainId, sourceChainId)
    } catch (e) {
        console.error(e);
        return NextResponse.json({ funded: false });
    }

    return NextResponse.json({ funded: true });
}