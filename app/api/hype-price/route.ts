import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://api.hyperliquid.xyz/info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "spotMetaAndAssetCtxs" }),
      next: { revalidate: 15 }, // Revalidate every 15 seconds
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Hyperliquid API Error:", errorData);
      throw new Error(
        `Failed to fetch from Hyperliquid API: ${response.statusText}`,
      );
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length < 2) {
      console.error("Unexpected data format from Hyperliquid API:", data);
      throw new Error("Unexpected data format from Hyperliquid API");
    }

    const meta = data[0];
    const spotAssetCtxs = data[1];

    if (
      !meta ||
      !meta.tokens ||
      !meta.universe ||
      !spotAssetCtxs ||
      !Array.isArray(spotAssetCtxs)
    ) {
      console.error("Invalid API response format:", data);
      throw new Error("Invalid API response format");
    }

    const { tokens, universe } = meta;

    const hypeToken = tokens.find(
      (t: { name: string }) => t.name.trim().toUpperCase() === "HYPE",
    );
    const usdcToken = tokens.find(
      (t: { name: string }) => t.name.trim().toUpperCase() === "USDC",
    );

    console.log("Found HYPE token:", JSON.stringify(hypeToken, null, 2));
    console.log("Found USDC token:", JSON.stringify(usdcToken, null, 2));

    if (!hypeToken) {
      throw new Error("HYPE token not found in metadata.");
    }
    if (!usdcToken) {
      throw new Error("USDC token not found in metadata.");
    }

    const hypeUniverse = universe.find((u: { tokens: number[] }) => {
      return (
        u.tokens.includes(hypeToken.index) && u.tokens.includes(usdcToken.index)
      );
    });

    if (!hypeUniverse) {
      throw new Error("HYPE/USDC trading pair not found in universe.");
    }

    const hypeAssetCtx = spotAssetCtxs[hypeUniverse.index];

    if (hypeAssetCtx && hypeAssetCtx.midPx) {
      const hypeToUsd = parseFloat(hypeAssetCtx.midPx);
      return NextResponse.json({ hypeToUsd });
    }

    throw new Error("HYPE asset context not found or midPx is missing.");
  } catch (error) {
    console.error("Error fetching HYPE price:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
