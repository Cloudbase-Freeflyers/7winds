import { ACCESSIBILITY_BULLETS } from "@/lib/constants";
import { whatsappLink } from "@/lib/constants";

export default function Accessibility() {
  const wa = whatsappLink(
    "היי 7Winds! אני מתעניין/ת בטיסה מותאמת — נשמח לתיאום אישי 🙏"
  );

  return (
    <section id="accessibility" className="section">
      <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-bl from-brand-green via-brand-sky to-[#0d8fb8] text-white p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="absolute -top-16 -end-16 w-64 h-64 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute -bottom-20 -start-20 w-80 h-80 rounded-full bg-brand-yellow/30 blur-3xl" />

        <div className="relative">
          <span className="text-3xl">♿</span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold">
            טיסות מותאמות לאנשים עם מגבלויות
          </h2>
          <p className="mt-3 text-white/90 text-lg max-w-2xl">
            אצלנו גם מי שחשב שזה לא אפשרי — יכול לעוף.
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {ACCESSIBILITY_BULLETS.map((b) => (
              <li
                key={b}
                className="flex items-start gap-3 rounded-2xl bg-white/10 backdrop-blur px-4 py-3 ring-1 ring-white/20"
              >
                <span className="mt-0.5">✔</span>
                <span className="font-medium">{b}</span>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-sm text-white/85 italic">
            * בתיאום מראש בלבד, בהתאם לסוג המגבלה ותנאי השטח.
          </p>

          <a
            href={wa}
            target="_blank"
            rel="noopener"
            className="mt-8 btn-whatsapp btn-lg"
          >
            דברו איתנו להתאמה אישית
          </a>
        </div>
      </div>
    </section>
  );
}
