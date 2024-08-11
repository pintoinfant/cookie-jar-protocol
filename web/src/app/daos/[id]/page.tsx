"use client";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import DonutChart from "@/components/DonutChart";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NotDaoMember } from "@/components/NotDaoMemeber";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useWriteContract } from "wagmi"
import { cookieJarContractAddress, cookieJarAbi } from "@/utils/const"
import { useRouter } from 'next/navigation';

export default function Home({ params }: { params: { id: string } }) {
    const account = useAccount();
    const router = useRouter();
    const [isMember, setIsMember] = useState(true);
    const [amountAbleToWithdraw, setAmountAbleToWithdraw] = useState(50);
    const [totalAmountInJar, setTotalAmountInJar] = useState(1000);
    const [amount, setAmount] = useState(10);
    const [message, setMessage] = useState("");
    const [chain, setChain] = useState("11155420");
    const { writeContractAsync } = useWriteContract()


    useEffect(() => { }, []);

    function handleWithdraw() {
        writeContractAsync({
            abi: cookieJarAbi,
            address: cookieJarContractAddress(84532),
            functionName: 'withdrawCC',
            args: [
                params.id,
                amount,
                message,
                chain,
            ]
        })
    }

    return (
        <main className="container flex min-h-screen flex-col items-center justify-center p-6 sm:p-8 md:p-10">
            <div className="absolute top-5 right-5 flex gap-2">
                <ConnectButton />
                <ModeToggle />
            </div>
            <div className="relative flex place-items-center my-8 md:my-12">
                <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-center uppercase">Cookie Jar</p>
            </div>

            <section className="w-full lg:max-w-5xl">
                {isMember ? (
                    <div className="ring-1 ring-zinc-700 rounded-xl p-6 sm:p-8 w-full">
                        <div className="flex flex-col md:flex-row justify-around text-center md:text-left mx-4 sm:mx-12 md:mx-24">
                            <p className="font-extrabold text-3xl sm:text-4xl md:text-5xl capitalize mt-4 md:mt-10">
                                The Power <br /> you possess
                            </p>
                            {/* Val 1 is the lower value. Val 2 is the higher value. The chart will show the percentage of Val 1 relative to Val 2. */}
                            <div className="mt-6 md:mt-0">
                                <DonutChart val1={amountAbleToWithdraw} val2={totalAmountInJar} />
                            </div>
                        </div>
                        <div className="my-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                className="dark:bg-[#111111] bg-zinc-200 ring-1 ring-black mt-2"
                                type="number"
                                id="amount"
                                placeholder="Amount to withdraw"
                                max={amountAbleToWithdraw}
                                min={1}
                                onChange={(e) => setAmount(Number(e.target.value))}
                            />
                        </div>
                        <div className="my-2">
                            <Label htmlFor="message">Message</Label>
                            <Input
                                className="dark:bg-[#111111] bg-zinc-200 ring-1 ring-black mt-2"
                                type="text"
                                id="message"
                                placeholder="Enter the message to write"
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                        <div className="my-2">
                            <Label htmlFor="chain">Chain</Label>
                            <Select onValueChange={(chainValue) => setChain(chainValue)} defaultValue={chain}>
                                <SelectTrigger className="w-full sm:w-[280px]">
                                    <SelectValue className="mt-2" placeholder="Choose a chain to withdraw" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="11155420">Optimism</SelectItem>
                                    <SelectItem value="84532">Base</SelectItem>
                                    <SelectItem value="919">Mode</SelectItem>
                                    <SelectItem value="44787">Celo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <Button onClick={handleWithdraw}>Submit</Button>
                        </div>
                    </div>
                ) : (
                    <NotDaoMember />
                )}
            </section>
        </main>
    );
}
