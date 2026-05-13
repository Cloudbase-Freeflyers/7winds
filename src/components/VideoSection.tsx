import Image from "next/image";
import { youtubeVideoId } from "@/lib/constants";

export default function VideoSection() {
  const embed = `https://www.youtube-nocookie.com/embed/${youtubeVideoId}?rel=0&modestbranding=1`;
  return (
    <section id="video" className="section bg-brand-soft">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-brand-black">
          מה זה טיסת חוויה?
        </h2>
        <p className="mt-3 text-brand-dark max-w-2xl mx-auto">
          סרטון קצר שמסביר מה קורה בטיסה, איך זה עובד, ולמה זה מתאים כמעט לכל אחד.
        </p>

        <div className="mt-10 mx-auto w-full max-w-xs sm:max-w-sm">
          <div className="relative aspect-[9/16] overflow-hidden rounded-3xl shadow-xl ring-1 ring-black/5 bg-black">
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

        {/* Real flight photos */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-md ring-1 ring-black/5">
            <Image
              src="/images/haifa-bay.jpeg"
              alt="טיסת מצנח רחיפה מעל חוף הים — 7Winds"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, 400px"
            />
          </div>
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-md ring-1 ring-black/5">
            <Image
              src="/images/field-flight.jpeg"
              alt="טיסת מצנח רחיפה עם נוף שדות — 7Winds"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, 400px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
