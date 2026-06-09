import { FLIGHT_STEPS, FLIGHT_FEATURES, HERO_FILM_VIDEO_ID } from "@/lib/constants";
import YouTubeEmbed from "@/components/v2/YouTubeEmbed";

export default function FlightExperienceV2() {
  return (
    <section id="experience" className="section bg-brand-soft">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-brand-black">
            איך נראית טיסה?
          </h2>
          <p className="mt-3 text-brand-dark max-w-2xl mx-auto">
            מההגעה ועד הנחיתה – הנה מה שמחכה לכם.
          </p>
        </div>

        <ol className="mt-8 grid gap-4 md:grid-cols-5">
          {FLIGHT_STEPS.map((step, i) => (
            <li key={step} className="relative">
              <div className="rounded-2xl bg-white ring-1 ring-black/5 p-5 h-full shadow-sm hover:shadow-md transition">
                <div className="w-10 h-10 rounded-full bg-sky-gradient text-white font-extrabold flex items-center justify-center">
                  {i + 1}
                </div>
                <p className="mt-4 text-brand-black font-semibold leading-snug">
                  {step}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {FLIGHT_FEATURES.map((f) => (
            <span
              key={f}
              className="rounded-full bg-white ring-1 ring-brand-sky/30 px-4 py-2 text-sm font-semibold text-brand-dark"
            >
              ✦ {f}
            </span>
          ))}
        </div>

        <div className="mt-10 max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-2 ring-brand-sky/25 bg-black">
            <div className="absolute inset-x-0 top-0 h-1 bg-sky-gradient z-10" aria-hidden />
            <div className="relative aspect-video">
              <YouTubeEmbed videoId={HERO_FILM_VIDEO_ID} />
            </div>
          </div>
          <p className="mt-3 text-center text-sm font-medium text-brand-dark">
            ▶ צפו בסרטון — טיסת חוויה עם 7Winds
          </p>
        </div>
      </div>
    </section>
  );
}
