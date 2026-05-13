import { LOCATIONS } from "@/lib/constants";

const SUBTITLES: Record<string, string> = {
  ארסוף: "צוקים ונוף ים מרהיב",
  נתניה: "טיסה מעל החוף הצפוני",
  "רמת הגולן": "טיסות גובה במרחבי הצפון",
  גלבוע: "נוף עמק יזרעאל מהאוויר",
};

export default function Locations() {
  return (
    <section id="locations" className="section">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-brand-black">
            איפה אנחנו טסים?
          </h2>
          <p className="mt-3 text-brand-dark max-w-2xl mx-auto">
            פריסה ארצית — ארסוף, נתניה, רמת הגולן וגלבוע.
          </p>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LOCATIONS.map((loc) => (
            <article
              key={loc}
              className="group relative rounded-3xl bg-white ring-1 ring-black/5 p-6 hover:shadow-xl transition overflow-hidden"
            >
              <div className="absolute inset-0 bg-sky-gradient opacity-0 group-hover:opacity-10 transition" />
              <div className="relative">
                <span className="text-2xl">📍</span>
                <h3 className="mt-2 font-display text-xl font-extrabold text-brand-black">
                  {loc}
                </h3>
                <p className="mt-1 text-brand-dark text-sm">
                  {SUBTITLES[loc]}
                </p>
                <a
                  href="#contact"
                  className="mt-4 inline-flex items-center gap-1 text-brand-sky font-bold text-sm hover:gap-2 transition-all"
                >
                  לקביעת טיסה ←
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
