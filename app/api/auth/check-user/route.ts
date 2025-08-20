import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const e = String(email ?? "").trim().toLowerCase();
    if (!e) return NextResponse.json({ error: "Invalid email" }, { status: 400 });

    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    if (!baseUrl || !serviceKey) {
      return NextResponse.json({ error: "Server config missing" }, { status: 500 });
    }

    const res = await fetch(`${baseUrl}/auth/v1/admin/users?email=${encodeURIComponent(e)}`, {
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: `Admin API error: ${text}` }, { status: 500 });
    }

    const data = await res.json(); // { users: [...] }
    const user = data?.users?.[0];
    const providers: string[] = (user?.identities ?? []).map((i: unknown) => {
      const identity = i as { provider?: string };
      return identity?.provider;
    }).filter(Boolean);

    return NextResponse.json({ exists: Boolean(user), providers });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}