import { whatsappLink } from "@/lib/constants";

export default function Hero() {
  const waMessage = "היי 7Winds! אשמח לפרטים על טיסת טנדם 🪂";

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-hero-radial text-white"
    >
      <div className="hero-cloud bg-brand-sky w-[420px] h-[420px] -top-20 -start-20" />
      <div
        className="hero-cloud bg-brand-green w-[360px] h-[360px] bottom-0 end-10"
        style={{ animationDelay: "1.5s" }}
      />
      <div
        className="hero-cloud bg-brand-yellow w-[260px] h-[260px] top-1/2 start-1/3"
        style={{ animationDelay: "3s" }}
      />

      <div className="relative max-w-5xl mx-auto px-5 sm:px-8 py-24 sm:py-28 lg:py-36 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-4 py-1.5 text-sm font-semibold ring-1 ring-white/20">
          🪂 בית הספר הגדול בישראל למצנחי רחיפה
        </span>

        <h1 className="mt-6 font-display font-extrabold tracking-tight text-4xl sm:text-5xl lg:text-6xl leading-tight">
          טיסת מצנח רחיפה זוגית (טנדם)
          <br />
          <span className="bg-sky-gradient bg-clip-text text-transparent">
            חוויה שלא תשכחו בחיים
          </span>
        </h1>

        <p className="mt-5 text-lg sm:text-xl text-white/85 max-w-2xl mx-auto">
          טיסה עם מדריך מקצועי · אין צורך בניסיון · נופים מטורפים
        </p>
        <p className="mt-2 text-base text-white/70 max-w-2xl mx-auto">
          המתנה היחידה שגורמת לצרוח… אבל מהתרגשות 😄
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <a href="#contact" className="btn-primary btn-lg w-full sm:w-auto">
            קבעו טיסה עכשיו
          </a>
          <a
            href={whatsappLink(waMessage)}
            target="_blank"
            rel="noopener"
            className="btn-whatsapp btn-lg w-full sm:w-auto"
          >
            שלחו הודעה בוואטסאפ
          </a>
        </div>

        <p className="mt-8 text-sm text-white/70">
          ♿ מתאים גם לאנשים עם מגבלויות – בתיאום מראש
        </p>
      </div>

      <svg
        className="block w-full -mb-px text-brand-soft"
        viewBox="0 0 1440 80"
        fill="currentColor"
        aria-hidden
      >
        <path d="M0,32 C240,80 480,80 720,48 C960,16 1200,16 1440,40 L1440,80 L0,80 Z" />
      </svg>
    </section>
  );
}
