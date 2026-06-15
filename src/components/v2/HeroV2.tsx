import Image from "next/image";
import AffiliateWhatsAppLink from "@/components/AffiliateWhatsAppLink";
import GiftVoucherBanner from "@/components/GiftVoucherBanner";
import { V2_IMAGES, WHATSAPP_MESSAGES } from "@/lib/constants";

const waMessage = WHATSAPP_MESSAGES.tandem;

export default function HeroV2() {
  return (
    <section id="top" className="relative isolate overflow-hidden text-white">
      <Image
        src={V2_IMAGES.tandemOverWater}
        alt=""
        fill
        priority
        className="object-cover object-[42%_38%] sm:object-[38%_40%] lg:object-[32%_center]"
        sizes="100vw"
      />

      {/* Darken text side (start/right in RTL) for readability */}
      <div className="absolute inset-0 bg-[#021929]/45" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-e from-[#021929]/92 via-[#021929]/70 to-[#021929]/25"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#021929]/60 via-transparent to-[#021929]/20"
        aria-hidden
      />

      <div className="relative max-w-5xl mx-auto px-5 sm:px-8 py-14 sm:py-18 lg:py-24">
        <div className="max-w-xl mx-auto lg:mx-0 lg:me-auto text-center lg:text-start">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold ring-1 ring-white/20">
            🪂 בית הספר הגדול בישראל למצנחי רחיפה
          </span>

          <h1 className="mt-5 font-display font-extrabold tracking-tight text-4xl sm:text-5xl lg:text-6xl leading-[1.1] drop-shadow-sm">
            10 דקות —
            <br />
            ועפים מעל הים
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(90deg, #38bdf8, #7dd3fc)" }}
            >
              🌊 חוויה לכל החיים
            </span>
          </h1>

          <p className="mt-5 text-xl text-white/90 font-semibold max-w-md lg:mx-0 mx-auto drop-shadow-sm">
            לא צריך ניסיון. רק להגיע. 😎
          </p>
          <p className="mt-1.5 text-base text-white/70 max-w-md lg:mx-0 mx-auto">
            טיסה עם מדריך מקצועי · נופים מטורפים · מתאים לכולם
          </p>

          <div className="mt-7 flex flex-col sm:flex-row justify-center lg:justify-start gap-3">
            <a href="#booking" className="btn-primary btn-lg w-full sm:w-auto text-center">
              קבעו טיסה עכשיו
            </a>
            <AffiliateWhatsAppLink
              message={waMessage}
              trackLabel="hero"
              className="btn-whatsapp btn-lg w-full sm:w-auto text-center"
            >
              💬 שלחו הודעה בוואטסאפ
            </AffiliateWhatsAppLink>
          </div>

          <GiftVoucherBanner variant="hero" className="mt-4 max-w-md lg:mx-0 mx-auto" />

          <p className="mt-4 text-sm font-semibold text-yellow-300 drop-shadow-sm">
            📅 סופי שבוע נתפסים מהר — מספר המקומות מוגבל
          </p>
          <p className="mt-2 text-xs text-white/55">
            ♿ מתאים גם לאנשים עם מגבלויות – בתיאום מראש
          </p>
        </div>
      </div>

      <svg
        className="relative block w-full -mb-px text-brand-soft"
        viewBox="0 0 1440 60"
        fill="currentColor"
        aria-hidden
      >
        <path d="M0,20 C360,60 720,0 1080,40 C1260,60 1380,50 1440,48 L1440,60 L0,60 Z" />
      </svg>
    </section>
  );
}
