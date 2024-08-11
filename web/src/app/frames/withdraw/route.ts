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

import { TransactionTargetResponse } from "frames.js";
import { NextRequest, NextResponse } from "next/server";
import { Abi, encodeFunctionData } from "viem";
import { cookieJarAbi } from "@/utils/const";

export async function POST(
  req: NextRequest
): Promise<NextResponse<TransactionTargetResponse>> {
  try {
    const searchParams = new URLSearchParams(req.url);
    // const jarId = searchParams.get("jarId");
    const jarId =
      "0xde991ad4fec493c8213aba5fd6da8659e31925c5431efcba4d7e63c816d6a31e";
    // const amount = searchParams.get("amount");
    const amount = 10000000000000;
    const note = searchParams.get("note");
    const calldata = encodeFunctionData({
      abi: cookieJarAbi,
      functionName: "withdraw",
      args: [jarId, amount, note],
    });
    return NextResponse.json({
      chainId: "eip155:11155420", // OP Sepolia
      method: "eth_sendTransaction",
      params: {
        abi: cookieJarAbi as Abi,
        to: "0xA0b3Fa18a089F8bff398Fe8B83B8aC97DFF90548",
        data: calldata,
        value: "0",
      },
    });
  } catch (error) {
    console.log(error);
    const calldata = encodeFunctionData({
      abi: cookieJarAbi,
      functionName: "createProfile",
      args: [
        BigInt(1),
        [BigInt(1), BigInt(1)],
        [BigInt(1), BigInt(1)],
        [BigInt(1), BigInt(1)],
        "Hello",
      ],
    });
    return NextResponse.json({
      chainId: "eip155:84532", // OP Mainnet 10
      method: "eth_sendTransaction",
      params: {
        abi: cookieJarAbi as Abi,
        to: "0x935A5B36C923CDFfD3986f2488E92Cf2D1d8c09D",
        data: calldata,
        value: "0",
      },
    });
  }
}
