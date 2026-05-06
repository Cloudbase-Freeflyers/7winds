import VoucherForm from "@/components/forms/VoucherForm";
import { VOUCHER_OCCASIONS } from "@/lib/constants";

export default function GiftVoucher() {
  return (
    <section id="voucher" className="section bg-white">
      <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-2 items-start">
        <div>
          <span className="inline-block rounded-full bg-brand-yellow/30 text-brand-black text-xs font-bold tracking-wide px-3 py-1">
            מתנה מקורית 🎁
          </span>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl font-extrabold text-brand-black">
            מחפשים מתנה שלא שוכחים?
          </h2>
          <p className="mt-4 text-brand-dark text-lg leading-relaxed">
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

          <div className="mt-8 rounded-2xl bg-sky-gradient p-6 text-white shadow-lg">
            <p className="font-bold text-lg">השובר תקף שנה מיום הרכישה</p>
            <p className="mt-1 text-white/85 text-sm">
              נשלח אליכם דיגיטלית לאחר הרכישה – מוכן להדפסה או למשלוח בוואטסאפ.
            </p>
          </div>
        </div>

        <VoucherForm />
      </div>
    </section>
  );
}
