import { NextResponse } from "next/server";

interface Token {
  name: string;
  index: number;
}

interface Universe {
  name?: string;
  tokens: number[];
  index: number;
}

interface Meta {
  tokens: Token[];
  universe: Universe[];
}

interface SpotAssetCtx {
  midPx: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const amountUSD = searchParams.get("amount");

  try {
    console.log("Fetching HYPE price from Hyperliquid API...");

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
    console.log("Raw API response structure:", {
      isArray: Array.isArray(data),
      length: data?.length,
      firstElementKeys: data?.[0] ? Object.keys(data[0]) : [],
      secondElementType: typeof data?.[1],
      secondElementLength: Array.isArray(data?.[1])
        ? data[1].length
        : "not array",
    });

    if (!Array.isArray(data) || data.length < 2) {
      console.error("Invalid response format:", data);
      throw new Error("Unexpected data format from Hyperliquid API");
    }

    const [meta, spotAssetCtxs] = data as [Meta, SpotAssetCtx[]];

    // Validate meta structure
    if (!meta || !meta.tokens || !meta.universe) {
      console.error("Invalid meta structure:", meta);
      throw new Error("Invalid metadata structure from Hyperliquid API");
    }

    // Validate spotAssetCtxs structure
    if (!Array.isArray(spotAssetCtxs)) {
      console.error("Invalid spotAssetCtxs structure:", spotAssetCtxs);
      throw new Error("Invalid spot asset contexts from Hyperliquid API");
    }

    console.log("Meta tokens count:", meta.tokens?.length);
    console.log("Meta universe count:", meta.universe?.length);
    console.log("Spot asset contexts count:", spotAssetCtxs.length);

    // Find HYPE token
    const hypeToken = meta.tokens.find(
      (t: Token) => t.name?.trim().toUpperCase() === "HYPE",
    );

    // Find USDC token
    const usdcToken = meta.tokens.find(
      (t: Token) => t.name?.trim().toUpperCase() === "USDC",
    );

    console.log("Found HYPE token:", hypeToken);
    console.log("Found USDC token:", usdcToken);

    if (!hypeToken) {
      console.error(
        "HYPE token not found in tokens list:",
        meta.tokens.map((t: Token) => t.name),
      );
      throw new Error("HYPE token not found in metadata");
    }

    if (!usdcToken) {
      console.error(
        "USDC token not found in tokens list:",
        meta.tokens.map((t: Token) => t.name),
      );
      throw new Error("USDC token not found in metadata");
    }

    // Find the universe pair that contains both HYPE and USDC
    const hypeUsdcUniverse = meta.universe.find((u: Universe) => {
      const hasHype = u.tokens?.includes(hypeToken.index);
      const hasUsdc = u.tokens?.includes(usdcToken.index);
      return hasHype && hasUsdc;
    });

    console.log("Found HYPE/USDC universe pair:", hypeUsdcUniverse);

    if (!hypeUsdcUniverse) {
      console.error("HYPE/USDC pair not found in universe:", {
        hypeIndex: hypeToken.index,
        usdcIndex: usdcToken.index,
        universeItems: meta.universe.map((u: Universe) => ({
          name: u.name,
          tokens: u.tokens,
          index: u.index,
        })),
      });
      throw new Error("HYPE/USDC trading pair not found in universe");
    }

    // Get the asset context using the universe index
    const hypeAssetCtx = spotAssetCtxs[hypeUsdcUniverse.index];

    console.log("HYPE asset context:", hypeAssetCtx);

    if (!hypeAssetCtx) {
      console.error(
        "Asset context not found at index:",
        hypeUsdcUniverse.index,
      );
      throw new Error("HYPE asset context not found");
    }

    if (!hypeAssetCtx.midPx) {
      console.error("midPx not found in asset context:", hypeAssetCtx);
      throw new Error("HYPE/USDC midPx is missing");
    }

    const hypeToUsd = parseFloat(hypeAssetCtx.midPx);

    if (isNaN(hypeToUsd) || hypeToUsd <= 0) {
      console.error("Invalid HYPE price:", hypeAssetCtx.midPx);
      throw new Error("Parsed HYPE price is not a valid positive number");
    }

    console.log("Successfully fetched HYPE price:", hypeToUsd);

    if (amountUSD) {
      const amount = parseFloat(amountUSD);
      if (isNaN(amount)) {
        return NextResponse.json(
          { error: "Invalid amount provided." },
          { status: 400 },
        );
      }
      const hypeAmount = amount / hypeToUsd;
      return NextResponse.json({ hypeToUsd, hypeAmount });
    }

    return NextResponse.json({ hypeToUsd });
  } catch (error) {
    console.error("Error fetching HYPE price:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
