import { NextResponse } from "next/server";
import { resolveAffiliate, recordAffiliateEvent } from "@/lib/affiliates";
import { logActivity } from "@/lib/activity-log";
import { notifyAsync, notifyNewLead } from "@/lib/email";
import { getDb } from "@/lib/mongodb";
import { leadSchema, normalizePhone } from "@/lib/validation";
import type { LeadDoc } from "@/types/submissions";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message || "פרטי הטופס לא תקינים";
    return NextResponse.json({ ok: false, error: first }, { status: 400 });
  }

  try {
    const affiliateCode = parsed.data.affiliateCode || undefined;
    const affiliate = await resolveAffiliate(affiliateCode);

    const db = await getDb();
    const doc: LeadDoc = {
      name: parsed.data.name,
      phone: normalizePhone(parsed.data.phone),
      message: parsed.data.message || undefined,
      source: parsed.data.source,
      status: "new",
      createdAt: new Date(),
      userAgent: req.headers.get("user-agent") || undefined,
      referrer: req.headers.get("referer") || undefined,
      ...(affiliate
        ? {
            affiliateId: String(affiliate._id),
            affiliateCode: affiliate.code,
          }
        : {}),
    };
    const result = await db.collection<LeadDoc>("leads").insertOne(doc);

    if (affiliate) {
      await recordAffiliateEvent(affiliate, "lead", {
        leadId: result.insertedId.toString(),
      });
    }

    const sourceLabel =
      doc.source === "accessibility" ? "נגישות" : "טופס יצירת קשר";
    notifyAsync(async () => {
      await logActivity({
        type: "lead",
        title: `ליד חדש — ${doc.name}`,
        detail: [`טלפון: ${doc.phone}`, `מקור: ${sourceLabel}`,
          doc.affiliateCode ? `שותף: ${doc.affiliateCode}` : null]
          .filter(Boolean).join(" · "),
      });
      await notifyNewLead(doc);
    });

    return NextResponse.json({ ok: true, id: result.insertedId.toString() });
  } catch (err) {
    console.error("[leads] insert failed", err);
    return NextResponse.json(
      { ok: false, error: "שמירה נכשלה. נסו שוב." },
      { status: 500 }
    );
  }
}
