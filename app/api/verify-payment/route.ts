import { NextResponse } from "next/server";
import {
  Address,
  GetLogsReturnType,
  createPublicClient,
  defineChain,
  http,
  parseAbiItem,
} from "viem";

// 1. Define the Hyperliquid Chain
const hyperliquid = defineChain({
  id: 1337,
  name: "Hyperliquid",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://api.hyperliquid.xyz/evm"],
    },
  },
  blockExplorers: {
    default: {
      name: "Hyperliquid Explorer",
      url: "https://explorer.hyperliquid.xyz",
    },
  },
});

const HYPE_CONTRACT_ADDRESS = "0xB50342502A4f40554C1e0A66479a61A14563a56f";
const RECEIVING_WALLET_ADDRESS = process.env.RECEIVING_WALLET_ADDRESS;

const client = createPublicClient({
  chain: hyperliquid,
  transport: http(),
});

// 2. Use parseAbiItem for a single event
const transferEventAbi = parseAbiItem(
  "event Transfer(address indexed from, address indexed to, uint256 value)",
);

// 3. Define a specific type for our logs
type TransferLog = GetLogsReturnType<typeof transferEventAbi>[0];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userAddress = searchParams.get("userAddress");
  const expectedAmount = searchParams.get("amount"); // Amount in HYPE, not wei
  const token = searchParams.get("token"); // e.g., 'HYPE'

  if (!userAddress || !expectedAmount || !token) {
    return NextResponse.json(
      { success: false, error: "Missing required query parameters." },
      { status: 400 },
    );
  }

  if (token !== "HYPE") {
    return NextResponse.json(
      { success: false, error: "Currently only HYPE token is supported." },
      { status: 400 },
    );
  }

  if (!RECEIVING_WALLET_ADDRESS) {
    console.error(
      "RECEIVING_WALLET_ADDRESS is not set in environment variables.",
    );
    return NextResponse.json(
      { success: false, error: "Server configuration error." },
      { status: 500 },
    );
  }

  try {
    // We need to convert the expected HYPE amount to its 'wei' equivalent for comparison
    // Assuming HYPE has 18 decimal places, like ETH
    const expectedAmountWei = BigInt(parseFloat(expectedAmount) * 1e18);
    const currentBlock = await client.getBlockNumber();

    // Fetch the last 100 blocks of Transfer events.
    // In a high-volume scenario, you might need a more robust way to not miss events.
    const logs: TransferLog[] = await client.getLogs({
      address: HYPE_CONTRACT_ADDRESS as Address,
      event: transferEventAbi,
      args: {
        from: userAddress as Address,
        to: RECEIVING_WALLET_ADDRESS as Address,
      },
      fromBlock: currentBlock - 100n, // Use correct block parameter type (bigint)
      toBlock: "latest",
    });

    // Find a transaction that meets the criteria
    const validTx = logs.find((log: TransferLog) => {
      // Access args safely, now correctly typed
      const { value } = log.args;

      // Ensure value is not undefined
      if (typeof value === "undefined") {
        return false;
      }

      // Add a small tolerance (e.g., 0.1%) for price fluctuations
      const tolerance = expectedAmountWei / BigInt(1000);
      return value >= expectedAmountWei - tolerance;
    });

    if (validTx) {
      return NextResponse.json({
        success: true,
        txHash: validTx.transactionHash,
      });
    } else {
      return NextResponse.json({ success: false }, { status: 404 });
    }
  } catch (error) {
    console.error("Error verifying payment on-chain:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify payment." },
      { status: 500 },
    );
  }
}
