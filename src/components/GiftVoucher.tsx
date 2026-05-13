import VoucherForm from "@/components/forms/VoucherForm";
import VoucherCard from "@/components/VoucherCard";
import { VOUCHER_OCCASIONS } from "@/lib/constants";

export default function GiftVoucher() {
  return (
    <section id="voucher" className="section bg-white">
      <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[1fr_2fr] items-start">
        <div>
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

          <div className="mt-6">
            <p className="text-sm font-bold text-brand-dark mb-3">מתאים ל:</p>
            <div className="flex flex-wrap gap-2">
              {VOUCHER_OCCASIONS.map((o) => (
                <span
                  key={o}
                  className="rounded-full bg-brand-soft ring-1 ring-black/5 px-3 py-1.5 text-sm text-brand-black font-medium"
                >
                  {o}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-sky-gradient p-5 text-white shadow-lg">
            <p className="font-bold">השובר תקף שנה מיום הרכישה</p>
            <p className="mt-1 text-white/85 text-sm">
              נשלח אליכם דיגיטלית לאחר הרכישה – מוכן להדפסה או למשלוח בוואטסאפ.
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 items-stretch">
          <VoucherCard />
          <VoucherForm />
        </div>
      </div>
    </section>
  );
}
