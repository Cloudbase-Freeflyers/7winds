import { TESTIMONIALS } from "@/lib/constants";

export default function Testimonials() {
  return (
    <section id="testimonials" className="section bg-brand-soft">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-brand-black">
            מה אומרים עלינו
          </h2>
          <p className="mt-3 text-brand-dark">
            מאות לקוחות מרוצים. הם הצליחו — גם אתם תצליחו.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <figure
              key={i}
              className="rounded-3xl bg-white ring-1 ring-black/5 p-7 shadow-sm hover:shadow-md transition"
            >
              <div className="text-2xl">⭐⭐⭐⭐⭐</div>
              <blockquote className="mt-3 text-brand-black font-display text-2xl font-bold leading-snug">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-4 text-brand-dark text-sm font-medium">
                — {t.author}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
