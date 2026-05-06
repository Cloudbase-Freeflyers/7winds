"use client";

import { whatsappLink } from "@/lib/constants";
import { track } from "@/lib/analytics";

export default function StickyWhatsApp() {
  const href = whatsappLink("היי 7Winds! אשמח לפרטים על טיסה 🪂");
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      onClick={() => track.whatsappClick("sticky")}
      aria-label="שלחו הודעה בוואטסאפ"
      className="fixed bottom-5 start-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-5 py-3.5 font-bold shadow-2xl shadow-emerald-500/40 hover:scale-105 active:scale-95 transition"
    >
      <span className="text-xl">💬</span>
      <span className="hidden sm:inline">דברו איתנו בוואטסאפ</span>
    </a>
  );
}
