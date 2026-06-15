"use client";

import AffiliateWhatsAppLink from "@/components/AffiliateWhatsAppLink";
import { WHATSAPP_MESSAGES } from "@/lib/constants";

export default function StickyWhatsApp() {
  return (
    <AffiliateWhatsAppLink
      message={WHATSAPP_MESSAGES.flight}
      trackLabel="sticky"
      aria-label="שלחו הודעה בוואטסאפ"
      className="fixed bottom-5 start-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-5 py-3.5 font-bold shadow-2xl shadow-emerald-500/40 hover:scale-105 active:scale-95 transition"
    >
      <span className="text-xl">💬</span>
      <span className="hidden sm:inline">דברו איתנו בוואטסאפ</span>
    </AffiliateWhatsAppLink>
  );
}
