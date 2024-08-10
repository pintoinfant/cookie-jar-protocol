// import { TransactionTargetResponse } from "frames.js";
// import { getFrameMessage } from "frames.js/next/server";
// import { NextRequest, NextResponse } from "next/server";
// import { Abi, encodeFunctionData } from "viem";
// import { getNextSixDates } from "@/lib/date";

// import { ABI } from "../../../lib/const";

// export async function POST(
//   req: NextRequest
// ): Promise<NextResponse<TransactionTargetResponse>> {
//   try {
//     console.log(req.url);
//     const searchParams = new URLSearchParams(req.url);
//     const owner = searchParams.get("owner");
//     const user = searchParams.get("userfid");
//     const d = searchParams.get("d");
//     const time = searchParams.get("t");
//     const dates = getNextSixDates();
//     const date = dates[parseInt(d!)];

//     const calldata = encodeFunctionData({
//       abi: ABI,
//       functionName: "bookCall",
//       args: [owner, user, time, 0, date, 4, 2024],
//     });
//     return NextResponse.json({
//       chainId: "eip155:84532", // OP Mainnet 10
//       method: "eth_sendTransaction",
//       params: {
//         abi: ABI as Abi,
//         to: "0x51d51C87e7f55547D202FCdBb5713bF9d4a5f6A4",
//         data: calldata,
//         value: "0",
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     const calldata = encodeFunctionData({
//       abi: ABI,
//       functionName: "createProfile",
//       args: [
//         BigInt(1),
//         [BigInt(1), BigInt(1)],
//         [BigInt(1), BigInt(1)],
//         [BigInt(1), BigInt(1)],
//         "Hello",
//       ],
//     });
//     return NextResponse.json({
//       chainId: "eip155:84532", // OP Mainnet 10
//       method: "eth_sendTransaction",
//       params: {
//         abi: ABI as Abi,
//         to: "0x935A5B36C923CDFfD3986f2488E92Cf2D1d8c09D",
//         data: calldata,
//         value: "0",
//       },
//     });
//   }
// }
