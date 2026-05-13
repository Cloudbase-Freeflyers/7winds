import { WHY_US } from "@/lib/constants";

const ICONS = ["🏆", "🎓", "🛡️", "📈", "📍", "♿"];

export default function WhyChooseUs() {
  return (
    <section id="why" className="section bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-brand-black">
            למה לטוס איתנו?
          </h2>
          <p className="mt-3 text-brand-dark max-w-2xl mx-auto">
            אלפי טיסות, ניסיון של עשורים, וצוות שיגרום לכם להרגיש בבית באוויר.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_US.map((reason, i) => (
            <div
              key={reason}
              className="group rounded-2xl bg-brand-soft ring-1 ring-black/5 p-6 hover:bg-white hover:shadow-lg transition"
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl group-hover:scale-110 transition">
                  {ICONS[i]}
                </span>
                <p className="text-brand-black font-semibold leading-relaxed">
                  {reason}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
