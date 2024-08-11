"use client";
import CreateJar from "@/components/screens/create-jar";
import { cookieJarAbi, OP_SEPOLIA_cookieJarAddress, BASE_SEPOLIA_cookieJarAddress } from "@/utils/const";

export default function Page() {
    return (
        <div className="">
            <CreateJar
                contractAddress={OP_SEPOLIA_cookieJarAddress}
                contractAbi={
                    cookieJarAbi
                } />
        </div>
    );
}