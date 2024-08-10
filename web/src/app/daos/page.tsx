"use client";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
} from "@/components/ui/select"


export default function Home() {
    const account = useAccount();
    const [isMember, setIsMember] = useState(true);
    const [amountAbleToWithdraw, setAmountAbleToWithdraw] = useState(50);
    const [totalAmountInJar, setTotalAmountInJar] = useState(1000);
    const [amount, setAmount] = useState(10);
    const [message, setMessage] = useState("");
    const [chain, setChain] = useState("optimism");

    useEffect(() => { }, []);

    function handleWithdraw() {
        console.log({
            amount,
            message,
            chain
        })
    }

    return (
        <main className="container flex min-h-screen flex-col items-center justify-center p-10">
            <div className="absolute top-5 right-5 flex gap-2">
                <ConnectButton />
                <ModeToggle />
            </div>
            <div className="relative flex place-items-center my-12">
                <p className="text-5xl font-bold text-center uppercase">Cookie Jar</p>
            </div>

            <section className="lg:max-w-5xl lg:w-full ">
                {isMember ? (
                    <div className="ring-1 ring-zinc-700 rounded-xl p-8 w-full">
                        <div className="flex justify-around text-center mx-24">
                            <p className=" font-extrabold text-5xl capitalize mt-10">The Power <br />you posses</p>
                            {/* Val 1 is the lower value. Val 2 is the higher value. The chart will show the percentage of Val 1 relative to Val 2. */}
                            <DonutChart val1={amountAbleToWithdraw} val2={totalAmountInJar} />
                        </div>
                        <div className="my-2">
                            <Label htmlFor="amount">Amount</Label>
                            <Input className="dark:bg-[#111111] bg-zinc-200 ring-1 ring-black mt-2" type="number" id="amount" placeholder="Amount to withdraw" max={amountAbleToWithdraw} min={1} onChange={(e) => setAmount(e.target.value)} />
                        </div>
                        <div className="my-2">
                            <Label htmlFor="message">Message</Label>
                            <Input className="dark:bg-[#111111] bg-zinc-200 ring-1 ring-black mt-2" type="text" id="message" placeholder="Enter the message to write" onChange={(e) => setMessage(e.target.value)} />
                        </div>
                        <div className="my-2">
                            <Label htmlFor="chain">Chain</Label>
                            <Select onValueChange={(chainValue) => setChain(chainValue)} 
                            defaultValue={chain}>
                                <SelectTrigger className="w-[280px]">
                                    <SelectValue className="mt-2" placeholder="Choose a chain to withdraw"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="optimism">Optimism</SelectItem>
                                    <SelectItem value="base">Base</SelectItem>
                                    <SelectItem value="mode">Mode</SelectItem>
                                    <SelectItem value="celo">Celo</SelectItem>
                                </SelectContent>
                            </Select>

                        </div>
                        <div className="mt-6 flex justify-end">
                            <Button onClick={handleWithdraw}>Submit</Button>
                        </div>
                    </div>) : <NotDaoMember />}
            </section>
        </main>
    );
}
