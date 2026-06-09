import Image from "next/image";
import AffiliateWhatsAppLink from "@/components/AffiliateWhatsAppLink";
import HeroPhoneVideo from "@/components/v2/HeroPhoneVideo";
import { HERO_FILM_VIDEO_ID, V2_IMAGES } from "@/lib/constants";

const waMessage = "היי 7Winds! אשמח לפרטים על טיסת טנדם 🪂";

export default function HeroV2() {
  return (
    <section id="top" className="relative isolate overflow-hidden text-white">
      <Image
        src={V2_IMAGES.tandemOverWater}
        alt=""
        fill
        priority
        className="object-cover object-center"
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
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          <div className="flex-1 text-center lg:text-start order-1">
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
              <a href="#contact" className="btn-primary btn-lg w-full sm:w-auto text-center">
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

            <p className="mt-4 text-sm font-semibold text-yellow-300 drop-shadow-sm">
              📅 סופי שבוע נתפסים מהר — מספר המקומות מוגבל
            </p>
            <p className="mt-2 text-xs text-white/55">
              ♿ מתאים גם לאנשים עם מגבלויות – בתיאום מראש
            </p>
          </div>

          <div className="order-2 shrink-0 w-[190px] sm:w-[210px] lg:w-[220px] mx-auto lg:mx-0">
            <div
              className="relative rounded-[2.5rem] p-[10px] shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
              style={{
                background: "linear-gradient(145deg, #1e293b, #0f172a)",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 30px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-14 h-4 rounded-full bg-[#0f172a] z-10 flex items-center justify-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#1e293b] ring-1 ring-white/10" />
              </div>

              <div className="relative aspect-[9/16] rounded-[2rem] overflow-hidden bg-black">
                <HeroPhoneVideo videoId={HERO_FILM_VIDEO_ID} />
              </div>

              <div className="mt-2 flex justify-center">
                <div className="w-24 h-1 rounded-full bg-white/20" />
              </div>
            </div>
          </div>

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
