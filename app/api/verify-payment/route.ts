import { LEDGER_RECEIVING_ADDRESS } from "@/constants/wallet";
import { NextResponse } from "next/server";
import { createPublicClient, http, parseUnits } from "viem";

const client = createPublicClient({
  transport: http("https://rpc.hyperliquid.xyz/evm"),
  chain: {
    id: 999,
    name: "HyperEVM",
    nativeCurrency: {
      name: "HYPE",
      symbol: "HYPE",
      decimals: 18,
    },
    rpcUrls: {
      default: { http: ["https://rpc.hyperliquid.xyz/evm"] },
    },
  },
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userAddress = searchParams.get("userAddress");
  const expectedAmount = searchParams.get("amount");
  const token = searchParams.get("token");

  console.log("Verifying payment with params:", {
    userAddress,
    expectedAmount,
    token,
  });

  if (!userAddress || !expectedAmount || !token) {
    return NextResponse.json(
      { confirmed: false, error: "Missing required query parameters." },
      { status: 400 },
    );
  }

  if (token !== "HYPE") {
    return NextResponse.json(
      {
        confirmed: false,
        error: "Currently only HYPE token is supported.",
      },
      { status: 400 },
    );
  }

  try {
    const expectedAmountWei = parseUnits(expectedAmount, 18);
    const currentBlockNumber = await client.getBlockNumber();
    const blockScanRange = 200n;

    console.log(
      `Scanning from block ${currentBlockNumber - blockScanRange}...`,
    );

    for (let i = 0n; i < blockScanRange; i++) {
      const block = await client.getBlock({
        blockNumber: currentBlockNumber - i,
        includeTransactions: true,
      });

      for (const tx of block.transactions) {
        // native currency transfers will not have a null `to` field
        if (!tx.to) continue;

        const isMatch =
          tx.to.toLowerCase() === LEDGER_RECEIVING_ADDRESS.toLowerCase() &&
          tx.from.toLowerCase() === userAddress.toLowerCase();

        if (isMatch) {
          const tolerance = parseUnits("0.01", 18);
          const difference =
            tx.value > expectedAmountWei
              ? tx.value - expectedAmountWei
              : expectedAmountWei - tx.value;

          if (difference <= tolerance) {
            console.log("Found valid native transaction:", {
              hash: tx.hash,
              from: tx.from,
              to: tx.to,
              value: tx.value.toString(),
            });
            return NextResponse.json({ txHash: tx.hash });
          }
        }
      }
    }

    console.log(
      `No matching native HYPE transaction found in the last ${blockScanRange} blocks.`,
    );

    return NextResponse.json({ confirmed: false }, { status: 404 });
  } catch (error) {
    console.error("Error verifying payment on-chain:", error);
    return NextResponse.json(
      { confirmed: false, error: "Failed to verify payment." },
      { status: 500 },
    );
  }
}
