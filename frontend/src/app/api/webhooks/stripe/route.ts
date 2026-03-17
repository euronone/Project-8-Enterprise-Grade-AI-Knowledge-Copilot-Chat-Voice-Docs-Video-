import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, provider: "stripe" });
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const payload = await request.text();

  // Signature verification should happen here using Stripe SDK + webhook secret.
  if (!signature || !payload) {
    return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
  }

  return NextResponse.json({ received: true });
}

