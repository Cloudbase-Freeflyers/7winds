import Image from "next/image";
import { youtubeVideoId } from "@/lib/constants";

export default function VideoSection() {
  const embed = `https://www.youtube-nocookie.com/embed/${youtubeVideoId}?rel=0&modestbranding=1`;
  return (
    <section id="video" className="section bg-brand-soft">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <div className="text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-brand-black">
            מה זה טיסת חוויה?
          </h2>
          <p className="mt-3 text-brand-dark max-w-xl mx-auto">
            סרטון קצר שמסביר מה קורה בטיסה, איך זה עובד, ולמה זה מתאים כמעט לכל אחד.
          </p>
        </div>

        {/* 3-column portrait grid — equal size, Instagram-style */}
        <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">

          {/* Photo 1 */}
          <div className="relative aspect-[9/16] rounded-2xl overflow-hidden shadow-md ring-1 ring-black/5">
            <Image
              src="/images/haifa-bay.jpeg"
              alt="טיסת מצנח רחיפה מעל חוף הים — 7Winds"
              fill
              className="object-cover object-center"
              sizes="33vw"
            />
          </div>

          {/* Video — centre panel */}
          <div className="relative aspect-[9/16] rounded-2xl overflow-hidden shadow-xl ring-2 ring-brand-sky/30 bg-black">
            <iframe
              className="absolute inset-0 w-full h-full"
              src={embed}
              title="טיסת מצנח רחיפה — 7Winds"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {/* Photo 2 */}
          <div className="relative aspect-[9/16] rounded-2xl overflow-hidden shadow-md ring-1 ring-black/5">
            <Image
              src="/images/field-flight.jpeg"
              alt="טיסת מצנח רחיפה עם נוף שדות — 7Winds"
              fill
              className="object-cover object-top"
              sizes="33vw"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
