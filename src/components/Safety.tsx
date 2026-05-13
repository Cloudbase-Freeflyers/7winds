import { SAFETY } from "@/lib/constants";

export default function Safety() {
  return (
    <section id="safety" className="section bg-brand-soft">
      <div className="max-w-5xl mx-auto text-center">
        <span className="text-2xl">🛡️</span>
        <h2 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-brand-black">
          הבטיחות שלכם — מעל הכל
        </h2>
        <p className="mt-3 text-brand-dark max-w-2xl mx-auto">
          אנחנו טסים יום-יום, ויודעים בדיוק מתי ואיך זה נכון.
        </p>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-start">
          {SAFETY.map((s) => (
            <div
              key={s}
              className="rounded-2xl bg-white p-5 ring-1 ring-black/5 shadow-sm"
            >
              <div className="w-9 h-9 rounded-full bg-brand-green/15 text-brand-green font-extrabold flex items-center justify-center">
                ✓
              </div>
              <p className="mt-3 text-brand-black font-semibold leading-snug">
                {s}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
