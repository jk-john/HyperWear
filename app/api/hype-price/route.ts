import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://api.hyperliquid.xyz/info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "spotMetaAndAssetCtxs" }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch from HyperLiquid API: ${response.statusText}`,
      );
    }

    const data = await response.json();

    const [meta, assetCtxs] = data;

    interface TokenInfo {
      name: string;
      index: number;
    }

    const hypeTokenInfo = meta.tokens.find(
      (token: TokenInfo) => token.name === "HYPE",
    );

    if (!hypeTokenInfo) {
      throw new Error("HYPE token not found in metadata");
    }

    const hypeTokenIndex = hypeTokenInfo.index;
    const hypeAssetCtx = assetCtxs[hypeTokenIndex];

    if (!hypeAssetCtx || !hypeAssetCtx.spotAssetCtx) {
      throw new Error("HYPE asset context not found");
    }

    const midPx = parseFloat(hypeAssetCtx.spotAssetCtx.midPx);

    if (isNaN(midPx)) {
      throw new Error("Invalid midPx value");
    }

    return NextResponse.json({ hypeToUsd: midPx });
  } catch (error) {
    console.error("Error fetching HYPE price:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new NextResponse(
      JSON.stringify({
        error: "Failed to fetch HYPE price",
        details: errorMessage,
      }),
      { status: 500 },
    );
  }
}
