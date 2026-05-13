import Image from "next/image";
import { youtubeVideoId } from "@/lib/constants";

export default function VideoSection() {
  const embed = `https://www.youtube-nocookie.com/embed/${youtubeVideoId}?rel=0&modestbranding=1`;
  return (
    <section id="video" className="section bg-brand-soft">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-brand-black">
            מה זה טיסת חוויה?
          </h2>
          <p className="mt-3 text-brand-dark max-w-2xl mx-auto">
            סרטון קצר שמסביר מה קורה בטיסה, איך זה עובד, ולמה זה מתאים כמעט לכל אחד.
          </p>
        </div>

        {/* Video + photos side-by-side on desktop */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 items-stretch">

          {/* Vertical video — fixed width on desktop so it doesn't stretch */}
          <div className="w-full sm:w-64 md:w-72 shrink-0 mx-auto sm:mx-0">
            <div className="relative aspect-[9/16] overflow-hidden rounded-3xl shadow-xl ring-1 ring-black/5 bg-black h-full">
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
          </div>

          {/* Photos — fill remaining space, stacked vertically */}
          <div className="flex flex-col gap-4 flex-1 min-w-0">
            <div className="relative rounded-2xl overflow-hidden flex-1 min-h-40 shadow-md ring-1 ring-black/5">
              <Image
                src="/images/haifa-bay.jpeg"
                alt="טיסת מצנח רחיפה מעל חוף הים — 7Winds"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
            <div className="relative rounded-2xl overflow-hidden flex-1 min-h-40 shadow-md ring-1 ring-black/5">
              <Image
                src="/images/field-flight.jpeg"
                alt="טיסת מצנח רחיפה עם נוף שדות — 7Winds"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
