import { NextResponse } from "next/server";
import { z } from "zod";
import { getAffiliateByCode, recordAffiliateEvent } from "@/lib/affiliates";

export const runtime = "nodejs";

const schema = z.object({
  code: z.string().trim().min(1).max(40),
  type: z.enum(["whatsapp_click"]),
  label: z.string().trim().max(80).optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }

  try {
    const affiliate = await getAffiliateByCode(parsed.data.code);
    if (!affiliate) {
      return NextResponse.json({ ok: false, error: "Affiliate not found" }, { status: 404 });
    }

    await recordAffiliateEvent(affiliate, parsed.data.type, {
      label: parsed.data.label,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[affiliates/event]", err);
    return NextResponse.json({ ok: false, error: "Failed to log event" }, { status: 500 });
  }
}
