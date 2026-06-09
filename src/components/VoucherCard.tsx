import Image from "next/image";
import { CONTACT, V2_IMAGES } from "@/lib/constants";

export default function VoucherCard() {
  return (
    <div
      dir="rtl"
      className="relative w-full max-w-lg mx-auto select-none"
      style={{ perspective: "1200px" }}
    >
      {/* Card shadow layer */}
      <div
        className="absolute inset-0 rounded-3xl translate-x-2 translate-y-3 bg-black/20 blur-sm"
        aria-hidden
      />

      <article
        className="relative aspect-[5/3] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/10"
        aria-label="שובר מתנה — טיסת חוויה במצנח רחיפה"
      >
        {/* Sky */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #7ec8f0 0%, #a8daf5 35%, #c5e8fa 60%, #8ecae6 100%)",
          }}
        />

        {/* Clouds */}
        <CloudLayer />

        {/* Tandem photo */}
        <Image
          src={V2_IMAGES.tandemOverWater}
          alt=""
          fill
          className="object-cover object-[32%_center] opacity-95"
          sizes="(max-width: 768px) 90vw, 512px"
          priority={false}
        />

        {/* Light wash so text reads */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-sky-200/30 via-transparent to-sky-900/25"
          aria-hidden
        />

        {/* Sparkles */}
        <Sparkles />

        {/* Hot air balloons */}
        <Balloon className="absolute top-[18%] end-[12%] w-7 h-9 opacity-90" colors={["#e85d04", "#f48c06"]} />
        <Balloon className="absolute top-[32%] end-[6%] w-5 h-7 opacity-80" colors={["#ffd60a", "#ffc300"]} />

        {/* Top ribbon banner */}
        <RibbonBanner text="טיסת חוויה במצנח רחיפה" />

        {/* Gift tag — top right */}
        <GiftTag />

        {/* Bottom strip */}
        <div className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-3 px-4 pb-3 pt-8 bg-gradient-to-t from-black/35 via-black/15 to-transparent">
          <WindsLogo />
          <div className="text-start pb-0.5">
            <p className="text-[10px] font-bold text-white/80 tracking-wide">להזמנה</p>
            <a
              href={`tel:${CONTACT.phoneTel}`}
              dir="ltr"
              className="font-display font-extrabold text-xl sm:text-2xl text-[#f97316] drop-shadow-md hover:brightness-110 transition"
            >
              {CONTACT.phoneDisplay}
            </a>
          </div>
        </div>

        {/* Decorative corner flourish */}
        <div
          className="absolute bottom-3 start-3 w-16 h-16 rounded-full opacity-20 blur-xl bg-brand-yellow pointer-events-none"
          aria-hidden
        />
      </article>
    </div>
  );
}

function RibbonBanner({ text }: { text: string }) {
  return (
    <div className="absolute top-3 start-0 z-30 flex items-center max-w-[78%]">
      <GoldBow className="w-9 h-9 -me-1 shrink-0 z-10 drop-shadow-md" />
      <div
        className="relative flex-1 py-2.5 ps-3 pe-5 rounded-e-xl shadow-lg"
        style={{
          background: "linear-gradient(180deg, #faf0dc 0%, #f0ddb8 100%)",
          border: "1px solid rgba(180,140,80,0.35)",
          boxShadow: "0 4px 14px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)",
        }}
      >
        <p className="font-display font-extrabold text-[#3d2e1a] text-sm sm:text-base leading-tight drop-shadow-sm">
          {text}
        </p>
        {/* Ribbon tail fold */}
        <div
          className="absolute top-full start-4 w-0 h-0"
          style={{
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderTop: "8px solid #c9a86c",
          }}
          aria-hidden
        />
      </div>
    </div>
  );
}

function GiftTag() {
  return (
    <div
      className="absolute top-2 end-3 z-30 flex flex-col items-center"
      style={{ transform: "rotate(4deg)" }}
    >
      <GoldBow className="w-7 h-7 -mb-2 z-10 drop-shadow" />
      <div
        className="relative px-4 py-2.5 pt-3 rounded-lg shadow-xl text-center min-w-[88px]"
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
          border: "2.5px solid #1ABBEF",
          boxShadow: "0 6px 20px rgba(0,0,0,0.18)",
        }}
      >
        <p className="font-display font-extrabold text-brand-sky text-sm leading-tight">
          שובר
        </p>
        <p className="font-display font-extrabold text-brand-sky text-sm leading-tight">
          מתנה
        </p>
        {/* Tag hole */}
        <div
          className="absolute -top-1 start-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-sky-100 ring-2 ring-brand-sky/40"
          aria-hidden
        />
      </div>
    </div>
  );
}

function GoldBow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <defs>
        <linearGradient id="bow-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>
      <ellipse cx="14" cy="18" rx="10" ry="7" fill="url(#bow-gold)" transform="rotate(-25 14 18)" />
      <ellipse cx="26" cy="18" rx="10" ry="7" fill="url(#bow-gold)" transform="rotate(25 26 18)" />
      <circle cx="20" cy="20" r="4" fill="#b45309" />
      <path d="M20 24v8" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function WindsLogo() {
  return (
    <div className="flex items-center gap-2 pb-0.5">
      <svg viewBox="0 0 56 40" className="w-12 h-9 shrink-0 drop-shadow-lg" aria-hidden>
        <path d="M4 32 Q18 4 32 20 Q22 28 4 32Z" fill="#FDD62A" opacity="0.95" />
        <path d="M12 34 Q26 8 40 22 Q30 30 12 34Z" fill="#8BC441" opacity="0.95" />
        <path d="M20 36 Q34 12 48 24 Q38 32 20 36Z" fill="#1ABBEF" opacity="0.95" />
      </svg>
      <div className="leading-none">
        <p className="font-display font-extrabold text-white text-lg drop-shadow-md">
          <span className="text-brand-yellow">7</span>winds
        </p>
        <p className="text-[9px] text-white/75 tracking-widest uppercase mt-0.5">
          Paragliding Club
        </p>
      </div>
    </div>
  );
}

function CloudLayer() {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden" aria-hidden>
      <Cloud className="top-[8%] start-[5%] w-28 opacity-80" />
      <Cloud className="top-[5%] start-[35%] w-36 opacity-70" />
      <Cloud className="top-[12%] end-[20%] w-24 opacity-60" />
      <Cloud className="bottom-[28%] start-[10%] w-32 opacity-50" />
      <Cloud className="bottom-[22%] end-[8%] w-40 opacity-55" />
    </div>
  );
}

function Cloud({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute ${className}`}>
      <div className="relative">
        <div className="w-full aspect-[2/1] rounded-full bg-white/85 blur-[1px]" />
        <div className="absolute -top-[30%] start-[15%] w-[45%] aspect-square rounded-full bg-white/90" />
        <div className="absolute -top-[20%] end-[10%] w-[35%] aspect-square rounded-full bg-white/85" />
      </div>
    </div>
  );
}

function Sparkles() {
  const stars = [
    { top: "14%", start: "22%", size: 14 },
    { top: "20%", start: "48%", size: 10 },
    { top: "10%", start: "62%", size: 12 },
    { top: "28%", start: "72%", size: 8 },
    { top: "38%", start: "18%", size: 9 },
    { top: "45%", start: "55%", size: 11 },
  ];
  return (
    <>
      {stars.map((s, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="absolute z-20 text-white drop-shadow pointer-events-none"
          style={{ top: s.top, insetInlineStart: s.start, width: s.size, height: s.size }}
          aria-hidden
        >
          <path
            fill="currentColor"
            opacity={0.85}
            d="M12 0l2.5 7.5H22l-6 4.5 2.5 7.5L12 15l-6.5 4.5 2.5-7.5L2 7.5h7.5z"
          />
        </svg>
      ))}
    </>
  );
}

function Balloon({
  className = "",
  colors,
}: {
  className?: string;
  colors: [string, string];
}) {
  return (
    <svg viewBox="0 0 40 52" className={className} aria-hidden>
      <defs>
        <linearGradient id={`balloon-${colors[0]}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors[0]} />
          <stop offset="100%" stopColor={colors[1]} />
        </linearGradient>
      </defs>
      <ellipse cx="20" cy="18" rx="14" ry="17" fill={`url(#balloon-${colors[0]})`} />
      <ellipse cx="16" cy="14" rx="4" ry="6" fill="white" opacity="0.25" />
      <path d="M20 35 L20 46" stroke="#666" strokeWidth="1" />
      <rect x="16" y="46" width="8" height="5" rx="1" fill="#8B6914" />
    </svg>
  );
}
