import AffiliateWhatsAppLink from "@/components/AffiliateWhatsAppLink";
import PayCheckoutModal from "@/components/PayCheckoutModal";
import { WHATSAPP_MESSAGES, type ProductPackage } from "@/lib/constants";

type PayableItem = {
  label: string;
  price: string;
  packageKey?: ProductPackage;
};

const PACKAGES = [
  {
    emoji: "🌊",
    title: "טיסת חוויה מעל הים",
    subtitle: "ארסוף / נתניה",
    items: [
      { label: "10 דקות", price: "₪300", packageKey: "10min" as const },
      { label: "20 דקות", price: "₪450", packageKey: "20min" as const },
      { label: "אקרובטיקה עם פעלולים 🔥", price: "₪500", packageKey: "acro" as const },
      { label: "תוספת צילום וידאו / תמונות 📸", price: "+₪150", packageKey: "media" as const },
    ] satisfies PayableItem[],
    perks: ["מתאים גם כמתנה", "אין צורך בניסיון", "מדריך צמוד"],
    highlight: false,
  },
  {
    emoji: "⛰️",
    title: "טיסות בצפון",
    subtitle: "רמת הגולן / גלבוע",
    items: [
      { label: "טיסת טנדם — גולן", price: "₪750", packageKey: "golan" as const },
      { label: "טיסת טנדם — גלבוע", price: "₪750", packageKey: "gilboa" as const },
    ] satisfies PayableItem[],
    perks: ["נוף עמק יזרעאל ורמת הגולן", "גובה טיסה מרשים", "חוויה שונה לגמרי"],
    highlight: true,
  },
];

const WA_MESSAGE = WHATSAPP_MESSAGES.tandem;

export default function Pricing() {
  return (
    <section id="pricing" className="section bg-brand-soft">
      <div className="max-w-5xl mx-auto">
        <div className="text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-brand-black">
            בחרו את החוויה שלכם
          </h2>
          <p className="mt-3 text-brand-dark max-w-xl mx-auto">
            כל טיסה מתבצעת עם מדריך מוסמך — אין צורך בניסיון קודם.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {PACKAGES.map((pkg) => (
            <article
              key={pkg.title}
              className={`relative rounded-3xl overflow-hidden shadow-xl ring-1 ${
                pkg.highlight
                  ? "bg-hero-radial text-white ring-brand-sky/30"
                  : "bg-white ring-black/5"
              }`}
            >
              {pkg.highlight && (
                <div className="absolute top-0 inset-x-0 h-1 bg-sky-gradient" />
              )}

              <div className="p-6 sm:p-7">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{pkg.emoji}</span>
                  <div>
                    <h3 className={`font-display text-xl font-extrabold ${pkg.highlight ? "text-white" : "text-brand-black"}`}>
                      {pkg.title}
                    </h3>
                    <p className={`text-sm ${pkg.highlight ? "text-white/60" : "text-brand-dark"}`}>
                      {pkg.subtitle}
                    </p>
                  </div>
                </div>

                <ul className={`divide-y ${pkg.highlight ? "divide-white/10" : "divide-black/5"}`}>
                  {pkg.items.map((item) => (
                    <li
                      key={item.label}
                      className="grid grid-cols-[1fr_auto_2.25rem] items-center gap-x-2 py-3"
                    >
                      <span className={`text-sm min-w-0 ${pkg.highlight ? "text-white/80" : "text-brand-dark"}`}>
                        {item.label}
                      </span>
                      <span
                        className={`font-extrabold text-lg tabular-nums text-end whitespace-nowrap ${
                          pkg.highlight ? "text-brand-yellow" : "text-brand-black"
                        }`}
                      >
                        {item.price}
                      </span>
                      <div className="flex items-center justify-center">
                        {item.packageKey ? (
                          <PayCheckoutModal
                            packageKey={item.packageKey}
                            label="💳"
                            className={`rounded-full px-2.5 py-1 text-xs font-bold transition ${
                              pkg.highlight
                                ? "bg-white/15 text-white hover:bg-white/25"
                                : "bg-brand-sky/10 text-brand-sky hover:bg-brand-sky/20"
                            }`}
                            orderType="direct"
                          />
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>

                <ul className="mt-4 flex flex-wrap gap-2">
                  {pkg.perks.map((p) => (
                    <li
                      key={p}
                      className={`flex items-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1 ${
                        pkg.highlight
                          ? "bg-white/10 text-white/80"
                          : "bg-brand-green/10 text-brand-green"
                      }`}
                    >
                      ✅ {p}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex gap-3">
                  <a href="#booking" className="btn-primary btn-md flex-1 text-center">
                    תפסו לי מקום
                  </a>
                  <AffiliateWhatsAppLink
                    message={WA_MESSAGE}
                    trackLabel="pricing"
                    className="btn-whatsapp btn-md px-4"
                    aria-label="שאלות בוואטסאפ"
                  >
                    💬
                  </AffiliateWhatsAppLink>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-brand-dark/70">
          📅 הטיסות מתבצעות בהתאם לתנאי מזג האוויר · מספר המקומות מוגבל בכל יום
        </p>
      </div>
    </section>
  );
}
