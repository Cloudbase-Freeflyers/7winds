import AffiliateWhatsAppLink from "@/components/AffiliateWhatsAppLink";
import ParagliderCanvas from "@/components/ParagliderCanvas";
import HeroPhoneVideo from "@/components/v2/HeroPhoneVideo";
import { HERO_FILM_VIDEO_ID } from "@/lib/constants";

const waMessage = "היי 7Winds! אשמח לפרטים על טיסת טנדם 🪂";

export default function HeroV2() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden text-white"
      style={{
        background:
          "linear-gradient(155deg, #021929 0%, #043d6b 40%, #0762a0 70%, #0e8fc7 100%)",
      }}
    >
      <ParagliderCanvas />

      <div className="absolute -top-32 -start-32 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #38bdf8, transparent 70%)" }} />
      <div className="absolute -bottom-24 -end-24 w-[400px] h-[400px] rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #0ea5e9, transparent 70%)" }} />

      <div className="relative max-w-5xl mx-auto px-5 sm:px-8 py-14 sm:py-18 lg:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          <div className="flex-1 text-center lg:text-start order-1">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold ring-1 ring-white/20">
              🪂 בית הספר הגדול בישראל למצנחי רחיפה
            </span>

            <h1 className="mt-5 font-display font-extrabold tracking-tight text-4xl sm:text-5xl lg:text-6xl leading-[1.1]">
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

            <p className="mt-5 text-xl text-white/85 font-semibold max-w-md lg:mx-0 mx-auto">
              לא צריך ניסיון. רק להגיע. 😎
            </p>
            <p className="mt-1.5 text-base text-white/55 max-w-md lg:mx-0 mx-auto">
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

            <p className="mt-4 text-sm font-semibold text-yellow-300">
              📅 סופי שבוע נתפסים מהר — מספר המקומות מוגבל
            </p>
            <p className="mt-2 text-xs text-white/40">
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
        className="block w-full -mb-px text-brand-soft"
        viewBox="0 0 1440 60"
        fill="currentColor"
        aria-hidden
      >
        <path d="M0,20 C360,60 720,0 1080,40 C1260,60 1380,50 1440,48 L1440,60 L0,60 Z" />
      </svg>
    </section>
  );
}
