"use client";

import { useState } from "react";
import { youtubeThumbnail } from "@/lib/constants";

type Props = {
  videoId: string;
  title?: string;
};

export default function YouTubeEmbed({
  videoId,
  title = "טיסת מצנח רחיפה — 7Winds",
}: Props) {
  const [playing, setPlaying] = useState(false);
  const [thumbSrc, setThumbSrc] = useState(() => youtubeThumbnail(videoId, "maxres"));

  if (playing) {
    return (
      <iframe
        className="absolute inset-0 w-full h-full"
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3`}
        title={title}
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
        src={thumbSrc}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        onError={() => setThumbSrc(youtubeThumbnail(videoId, "hq"))}
      />
      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors" />

      <div className="absolute bottom-4 start-4 sm:bottom-5 sm:start-5">
        <div className="flex items-center gap-2 rounded-full bg-white/95 ps-1.5 pe-4 py-1.5 shadow-lg ring-1 ring-black/5 group-hover:bg-white group-hover:scale-[1.02] transition-all">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-sky text-white shadow-md">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 translate-x-0.5" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="font-display text-sm font-extrabold text-brand-black">
            נגן סרטון
          </span>
        </div>
      </div>
    </button>
  );
}
