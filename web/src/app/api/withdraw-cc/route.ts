// export const dynamic = "force-dynamic"; // defaults to auto
import { NextResponse } from "next/server";
import { ethers } from "ethers";
import { optimismSepolia, celoAlfajores, baseSepolia, modeTestnet, celo } from "viem/chains"
import * as abi from "../../../../../goldsky/abi.json"

const withdrawCCRequest = async (jarId: string, amount: string, note: string, sender: string, chainId: string) => {
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
    await contract.initiateCCWithdrawal(jarId, amount, sender, note, chainId)
}

export async function POST(request: Request) {
    const req = await request.json();
    const { jarId, amount, note, requester, chainId } = req;
    try {
        await withdrawCCRequest(jarId, amount, note, requester, chainId)
    } catch (e) {
        console.error(e);
        return NextResponse.json({ funded: false });
    }

    return NextResponse.json({ funded: true });
}