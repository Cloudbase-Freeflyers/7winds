import { PRICING_LOCATIONS, PRICING_NOTES } from "@/lib/constants";

export default function Pricing() {
  return (
    <section id="pricing" className="section">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-brand-black">
            מחירים ומסלולים
          </h2>
          <p className="mt-3 text-brand-dark max-w-2xl mx-auto">
            בחרו את החוויה המתאימה לכם – טיסות חוויה מהמרכז ועד הצפון.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {PRICING_LOCATIONS.map((loc) => (
            <article
              key={loc.id}
              className="relative rounded-3xl bg-white shadow-xl ring-1 ring-black/5 p-5 sm:p-7 overflow-hidden"
            >
              <div className="absolute -top-10 -end-10 w-32 h-32 rounded-full bg-brand-sky/15 blur-2xl" />
              <h3 className="font-display text-xl font-extrabold text-brand-black">
                {loc.title}
              </h3>
              <ul className="mt-6 divide-y divide-black/5">
                {loc.items.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center justify-between py-3 text-brand-dark"
                  >
                    <span>{item.label}</span>
                    <span className="font-bold text-brand-black text-lg">
                      {item.price}
                    </span>
                  </li>
                ))}
              </ul>
              <a href="#contact" className="mt-7 btn-primary btn-md w-full">
                תפסו לי מקום
              </a>
            </article>
          ))}
        </div>

        <ul className="mt-7 grid gap-3 sm:grid-cols-3 text-center text-sm text-brand-dark">
          {PRICING_NOTES.map((note) => (
            <li
              key={note}
              className="rounded-2xl bg-white/70 ring-1 ring-black/5 px-4 py-3"
            >
              {note}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
