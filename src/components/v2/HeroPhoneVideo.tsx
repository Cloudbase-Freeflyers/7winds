"use client";

import { useState } from "react";

interface HeroPhoneVideoProps {
  videoId: string;
}

export default function HeroPhoneVideo({ videoId }: HeroPhoneVideoProps) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        className="absolute inset-0 w-full h-full"
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
        title="7Winds — טיסת חוויה"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative block w-full h-full"
      aria-label="נגן סרטון"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://img.youtube.com/vi/${videoId}/0.jpg`}
        alt="תצוגה מקדימה — 7Winds"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#021929] translate-x-0.5" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-red-500" aria-hidden>
          <path d="M10 15l5.19-3L10 9v6z" /><path d="M21 3H3v18h18V3zm-2 16H5V5h14v14z" />
        </svg>
        <span className="text-white text-[10px] font-bold">Shorts</span>
      </div>
    </button>
  );
}
