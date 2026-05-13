import { TESTIMONIALS } from "@/lib/constants";

const AVATAR_STYLES = [
  { bg: "bg-brand-sky",    text: "text-white" },
  { bg: "bg-brand-green",  text: "text-white" },
  { bg: "bg-brand-yellow", text: "text-brand-black" },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="section bg-brand-soft">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-brand-black">
            מה אומרים עלינו
          </h2>
          <p className="mt-3 text-brand-dark">
            מאות לקוחות מרוצים. הם הצליחו — גם אתם תצליחו.
          </p>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => {
            const avatar = AVATAR_STYLES[i % AVATAR_STYLES.length];
            const initial = t.author.charAt(0);
            return (
              <figure
                key={i}
                className="rounded-3xl bg-white ring-1 ring-black/5 p-5 shadow-sm hover:shadow-md transition flex flex-col"
              >
                <div className="text-xl">⭐⭐⭐⭐⭐</div>
                <blockquote className="mt-3 flex-1 text-brand-black font-display text-lg font-bold leading-snug">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-base shrink-0 ${avatar.bg} ${avatar.text}`}
                  >
                    {initial}
                  </div>
                  <span className="text-brand-dark text-sm font-semibold">
                    {t.author}
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
