import Image from "next/image";
import { V2_IMAGES } from "@/lib/constants";

export default function VideoSectionV2() {
  return (
    <section id="video" className="section bg-brand-soft">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-brand-black">
            מה זה טיסת חוויה?
          </h2>
          <p className="mt-3 text-brand-dark max-w-xl mx-auto">
            צילומים אמיתיים מטיסות — מעל הים ומעל עמק יזרעאל.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 max-w-lg mx-auto">
          <div className="relative aspect-[9/16] rounded-3xl overflow-hidden shadow-md ring-1 ring-black/5">
            <Image
              src={V2_IMAGES.tandemSeaVertical}
              alt="טיסת מצנח רחיפה מעל הים — 7Winds"
              fill
              className="object-cover object-[30%_center] rounded-3xl"
              sizes="40vw"
            />
          </div>

          <div className="relative aspect-[9/16] rounded-3xl overflow-hidden shadow-md ring-1 ring-black/5">
            <Image
              src={V2_IMAGES.fieldFlightVertical}
              alt="טיסת מצנח רחיפה עם נוף שדות — 7Winds"
              fill
              className="object-cover object-center rounded-3xl"
              sizes="40vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
