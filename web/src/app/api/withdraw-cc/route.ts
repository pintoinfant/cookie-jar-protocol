// export const dynamic = "force-dynamic"; // defaults to auto
import { NextResponse } from "next/server";
import { ethers } from "ethers";
import { optimismSepolia, celoAlfajores, baseSepolia, modeTestnet, celo } from "viem/chains"
import { cookieJarAbi } from "@/utils/const"

const toBigNumber = (value: string) => {
    return ethers.toBigInt(value)
}

const withdrawCCRequest = async (jarId: string, amount: string, note: string, sender: string, chainId: string) => {
    let rpcUrl = ''
    let address = ''
    const OP_CONTRACT = '0xA0b3Fa18a089F8bff398Fe8B83B8aC97DFF90548'
    const BASE_CONTRACT = '0x0810b2d3c23d7207c6b15fb6b3303e99561cb80f'

    if (Number(chainId) == optimismSepolia.id) {
        rpcUrl = optimismSepolia.rpcUrls.default.http[0] as string
        console.log(rpcUrl)
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
    const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY as string, provider);
    const contract = new ethers.Contract(address, cookieJarAbi, wallet)
    console.log(`Calling jarId: ${jarId}, amount: ${amount}, note: ${note}, sender: ${sender}, chainId: ${chainId}`)
    console.log(`Contract: ${address}`)
    console.log(jarId,
        amount,
        sender,
        note,
        chainId
    )

    const tx = await contract.initiateCCWithdrawal(
        jarId,
        amount,
        sender,
        note,
        chainId
    )
    console.log(`Transaction hash: ${tx.hash}`);
    // Optionally wait for the transaction to be mined
    await tx.wait();
    console.log('Transaction confirmed!');
}

export async function POST(request: Request) {
    const req = await request.json();
    const { jar_id, amount, note, requester, chain_id } = req.data.new;
    console.log(jar_id, amount, note, requester, chain_id)
    try {
        await withdrawCCRequest(jar_id, amount, note, requester, chain_id)
    } catch (e) {
        console.error(e);
        return NextResponse.json({ funded: false });
    }

    return NextResponse.json({ funded: true });
}
