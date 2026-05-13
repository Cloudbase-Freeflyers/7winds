"use client";
import { useRef } from "react";
import { YOUTUBE_SHORTS, YOUTUBE_SHORTS_URL } from "@/lib/constants";

export default function ShortsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "prev" | "next") {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 12
      : 200;
    el.scrollBy({ left: dir === "next" ? cardWidth * 2 : -cardWidth * 2, behavior: "smooth" });
  }

  return (
    <section id="shorts" className="section bg-brand-soft overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 flex-wrap mb-8">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-brand-black">
              7Winds בחיים האמיתיים
            </h2>
            <p className="mt-2 text-brand-dark text-lg">
              רגעים מהשטח — ישר מהערוץ שלנו
            </p>
          </div>
          <a
            href={YOUTUBE_SHORTS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary btn-md flex-shrink-0"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            לכל הסרטונים ביוטיוב
          </a>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Prev arrow */}
          <button
            onClick={() => scroll("prev")}
            aria-label="הקודם"
            className="absolute -start-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white ring-1 ring-black/10 shadow flex items-center justify-center hover:bg-brand-yellow transition-colors"
          >
            <svg className="w-5 h-5 rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Track */}
          <div
            ref={trackRef}
            className="flex gap-3 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {YOUTUBE_SHORTS.map((short) => (
              <a
                key={short.id}
                href={`https://www.youtube.com/shorts/${short.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 snap-start group relative rounded-2xl overflow-hidden ring-1 ring-black/8 hover:ring-brand-sky/60 transition-all hover:scale-[1.02]"
                style={{ width: 180, aspectRatio: "9/16" }}
                aria-label={`צפו ב-Short ${short.id}`}
              >
                {/* Thumbnail */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://i.ytimg.com/vi/${short.id}/hqdefault.jpg`}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                {/* Shorts badge */}
                <div className="absolute top-2 start-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M17.77 10.32l-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.23-2.53-5.06-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25l1.2.5L6 14.94c-1.84.96-2.53 3.23-1.56 5.06.97 1.83 3.23 2.53 5.06 1.56l8.5-4.5c1.29-.68 2.07-2.04 2-3.49-.07-1.42-.93-2.67-2.23-3.25z" />
                  </svg>
                  <span className="text-white text-[10px] font-bold">Shorts</span>
                </div>
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full bg-white/85 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5 text-brand-black translate-x-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Next arrow */}
          <button
            onClick={() => scroll("next")}
            aria-label="הבא"
            className="absolute -end-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white ring-1 ring-black/10 shadow flex items-center justify-center hover:bg-brand-yellow transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
