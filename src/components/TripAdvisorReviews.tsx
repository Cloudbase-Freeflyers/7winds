const TA_URL =
  "https://www.tripadvisor.com/Attraction_Review-g297759-d2094704-Reviews-7_Winds_Tandem_Paragliding-Netanya_Central_District.html";

const REVIEWS = [
  {
    title: "Absolutely unforgettable experience!",
    text: "Booked a tandem flight over the cliffs of Netanya and it was hands-down the best thing I've done in Israel. The instructor was calm, professional and made me feel completely safe. The views over the Mediterranean were jaw-dropping. I screamed with excitement the whole way down!",
    author: "Sarah M.",
    location: "London, UK",
    date: "March 2025",
    rating: 5,
  },
  {
    title: "Best activity in Israel — full stop",
    text: "We were a group of 6 and every single one of us had the time of our lives. The staff were incredibly professional, the equipment was top-notch, and the whole experience was so well organised. Highly recommend the 20-minute flight — worth every shekel.",
    author: "Yoni K.",
    location: "Tel Aviv, Israel",
    date: "January 2025",
    rating: 5,
  },
  {
    title: "Perfect birthday gift",
    text: "Bought a voucher for my husband's birthday and he couldn't stop talking about it for weeks. The team took care of everything from arrival to landing. He said the feeling of gliding over the sea was like nothing he'd ever experienced. Will 100% be back.",
    author: "Michal R.",
    location: "Haifa, Israel",
    date: "February 2025",
    rating: 5,
  },
  {
    title: "Super professional and fun",
    text: "I was nervous at first — heights aren't really my thing — but the instructor was so reassuring and patient. After 30 seconds in the air I forgot all my fears and just enjoyed the incredible scenery. The team was friendly, punctual and very safety-conscious.",
    author: "David L.",
    location: "New York, USA",
    date: "April 2025",
    rating: 5,
  },
  {
    title: "Breathtaking views, amazing team",
    text: "Flew with 7 Winds during a family trip to Israel and it was the highlight of our holiday. My teenage kids were thrilled and even my wife who is afraid of heights managed to enjoy it. The instructors spoke great English and explained everything clearly.",
    author: "James T.",
    location: "Sydney, Australia",
    date: "December 2024",
    rating: 5,
  },
  {
    title: "A must-do if you're in Netanya",
    text: "Came across 7 Winds on TripAdvisor and decided to give it a go on my last day in Israel. Best spontaneous decision I've ever made. The flight lasted about 15 minutes but felt like a dream. The whole operation was slick and the instructor was a total pro.",
    author: "Anna W.",
    location: "Berlin, Germany",
    date: "November 2024",
    rating: 5,
  },
];

function BubbleRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={`w-4 h-4 ${i < rating ? "text-[#00AA6C]" : "text-gray-200"}`}
          fill="currentColor"
          aria-hidden
        >
          <circle cx="12" cy="12" r="10" />
        </svg>
      ))}
    </div>
  );
}

function TaLogo() {
  return (
    <span className="inline-flex items-center gap-1.5 font-bold text-[#00AA6C] text-lg tracking-tight select-none">
      <svg viewBox="0 0 50 50" className="w-7 h-7" aria-hidden>
        <circle cx="25" cy="25" r="25" fill="#00AA6C" />
        <circle cx="16" cy="22" r="5" fill="white" />
        <circle cx="34" cy="22" r="5" fill="white" />
        <circle cx="16" cy="22" r="2.5" fill="#00AA6C" />
        <circle cx="34" cy="22" r="2.5" fill="#00AA6C" />
        <path d="M10 30 Q25 42 40 30" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
      tripadvisor
    </span>
  );
}

export default function TripAdvisorReviews() {
  return (
    <section className="section bg-white">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <TaLogo />
            <div className="mt-3 flex items-center gap-3 flex-wrap">
              <BubbleRating rating={5} />
              <span className="font-extrabold text-brand-black text-lg">5.0</span>
              <span className="text-[#00AA6C] font-bold">Excellent</span>
              <span className="text-brand-dark text-sm">· Based on 47 reviews</span>
            </div>
          </div>
          <a
            href={TA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#00AA6C] hover:underline shrink-0"
          >
            See all reviews on TripAdvisor
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden>
              <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
            </svg>
          </a>
        </div>

        {/* Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <article
              key={i}
              className="flex flex-col rounded-2xl border border-black/8 bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              <BubbleRating rating={r.rating} />

              <h3 className="mt-3 font-bold text-brand-black text-sm leading-snug line-clamp-2">
                {r.title}
              </h3>

              <p className="mt-2 text-brand-dark text-sm leading-relaxed line-clamp-4 flex-1">
                {r.text}
              </p>

              <div className="mt-4 pt-4 border-t border-black/6 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#00AA6C]/15 text-[#00AA6C] font-extrabold text-sm flex items-center justify-center shrink-0">
                    {r.author.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-brand-black text-xs truncate">{r.author}</p>
                    <p className="text-brand-dark text-xs truncate">{r.location}</p>
                  </div>
                </div>
                <span className="text-brand-dark text-xs shrink-0">{r.date}</span>
              </div>
            </article>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-8 text-center">
          <a
            href={TA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#00AA6C] text-[#00AA6C] font-bold px-6 py-2.5 text-sm hover:bg-[#00AA6C] hover:text-white transition"
          >
            <TaLogo />
            <span>Read all reviews</span>
          </a>
        </div>

      </div>
    </section>
  );
}
