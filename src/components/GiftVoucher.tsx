"use client";

import { useState } from "react";
import VoucherForm from "@/components/forms/VoucherForm";
import VoucherCard from "@/components/VoucherCard";
import { VOUCHER_OCCASIONS } from "@/lib/constants";

export default function GiftVoucher() {
  const [recipientName, setRecipientName] = useState("");
  const [occasion, setOccasion] = useState("");

  return (
    <section id="voucher" className="section bg-gradient-to-b from-white via-brand-soft/40 to-brand-soft">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block rounded-full bg-brand-yellow/30 text-brand-black text-xs font-bold tracking-wide px-3 py-1">
            מתנה מקורית 🎁
          </span>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold text-brand-black">
            מחפשים מתנה שלא שוכחים?
          </h2>
          <p className="mt-3 text-brand-dark leading-relaxed">
            שובר מתנה לטיסת מצנח רחיפה – חוויה בלתי נשכחת שגורמת לעיניים לזרוח
            ולחיוך לא להעלם.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] items-start lg:items-center">
          <div className="flex flex-col items-center gap-6">
            <VoucherCard recipientName={recipientName} occasion={occasion} />

            <div className="w-full max-w-lg space-y-4">
              <div>
                <p className="text-sm font-bold text-brand-dark mb-3 text-center lg:text-start">
                  מתאים ל:
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                  {VOUCHER_OCCASIONS.map((o) => (
                    <span
                      key={o}
                      className="rounded-full bg-white ring-1 ring-black/5 px-3 py-1.5 text-sm text-brand-black font-medium shadow-sm"
                    >
                      {o}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-sky-gradient p-5 text-white shadow-lg text-center lg:text-start">
                <p className="font-bold">השובר תקף שנה מיום הרכישה</p>
                <p className="mt-1 text-white/85 text-sm">
                  נשלח אליכם דיגיטלית לאחר הרכישה – מוכן להדפסה או למשלוח בוואטסאפ.
                </p>
              </div>
            </div>
          </div>

          <VoucherForm
            onRecipientNameChange={setRecipientName}
            onOccasionChange={setOccasion}
          />
        </div>
      </div>
    </section>
  );
}
