import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, provider: "slack" });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));

  if (body?.type === "url_verification" && body?.challenge) {
    return NextResponse.json({ challenge: body.challenge });
  }

  return NextResponse.json({ received: true });
}

