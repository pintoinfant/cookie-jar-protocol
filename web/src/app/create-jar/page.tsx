"use client";
import CreateJar from "@/components/screens/create-jar";
import { cookieJarAbi, cookieJarContractAddress } from "@/utils/const";
import { useChainId } from "wagmi";

export default function Page() {
    const chainId = useChainId();
    return (
        <div className="">
            <CreateJar
                contractAddress={
                    cookieJarContractAddress(chainId) as string
                }
                contractAbi={
                    cookieJarAbi
                } />
        </div>
    );
}