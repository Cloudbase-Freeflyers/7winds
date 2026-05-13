export default function VoucherCard() {
  return (
    <div
      dir="rtl"
      className="relative rounded-3xl overflow-hidden ring-1 ring-black/8 shadow-xl select-none"
      style={{ background: "linear-gradient(135deg, #050F1C 0%, #0c2340 55%, #0d4a6e 100%)" }}
    >
      {/* Sky blobs */}
      <div
        className="absolute top-0 start-0 w-64 h-64 rounded-full opacity-30 blur-3xl"
        style={{ background: "#1ABBEF" }}
      />
      <div
        className="absolute bottom-0 end-0 w-48 h-48 rounded-full opacity-25 blur-3xl"
        style={{ background: "#8BC441" }}
      />
      <div
        className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full opacity-15 blur-3xl"
        style={{ background: "#FDD62A" }}
      />

      <div className="relative px-8 py-8">
        {/* Top row — logo + badge */}
        <div className="flex items-start justify-between gap-4">
          {/* Logo text */}
          <div>
            <div className="flex items-center gap-2">
              <span
                className="font-display font-extrabold text-3xl tracking-tight"
                style={{ color: "#FDD62A" }}
              >
                7
              </span>
              <span className="font-display font-bold text-2xl text-white">winds</span>
            </div>
            <p className="text-white/50 text-xs tracking-widest uppercase mt-0.5">
              Paragliding Club
            </p>
          </div>
          {/* Gift badge */}
          <div
            className="rounded-2xl px-4 py-2 text-center"
            style={{ background: "rgba(253,214,42,0.15)", border: "1px solid rgba(253,214,42,0.3)" }}
          >
            <p className="text-[10px] font-bold tracking-widest text-white/60 uppercase mb-0.5">
              שובר מתנה
            </p>
            <p className="text-white font-display font-extrabold text-lg leading-none">
              GIFT
            </p>
            <p className="text-white font-display font-extrabold text-lg leading-none">
              VOUCHER
            </p>
          </div>
        </div>

        {/* Paraglider silhouette — pure CSS */}
        <div className="my-6 flex justify-center">
          <svg
            viewBox="0 0 240 90"
            className="w-56 opacity-70"
            fill="none"
            aria-hidden
          >
            {/* Canopy */}
            <ellipse cx="120" cy="28" rx="70" ry="18" fill="#1ABBEF" opacity="0.5" />
            <ellipse cx="80" cy="26" rx="30" ry="14" fill="#8BC441" opacity="0.6" />
            <ellipse cx="160" cy="26" rx="30" ry="14" fill="#FDD62A" opacity="0.5" />
            {/* Lines */}
            {[100, 112, 120, 128, 140].map((x, i) => (
              <line
                key={i}
                x1={x}
                y1={30}
                x2={120}
                y2={68}
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="0.8"
              />
            ))}
            {/* Harness body */}
            <rect x="112" y="62" width="16" height="12" rx="4" fill="white" opacity="0.6" />
            {/* Person head */}
            <circle cx="120" cy="56" r="5" fill="white" opacity="0.55" />
          </svg>
        </div>

        {/* Main title */}
        <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white leading-tight text-center">
          טיסת מצנח רחיפה
          <br />
          <span style={{ color: "#FDD62A" }}>זוגית (טנדם)</span>
        </h3>
        <p className="mt-2 text-center text-white/65 text-sm">
          חוויה בלתי נשכחת מעל נופי ישראל
        </p>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-white/15" />
          <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow opacity-60" />
          <div className="flex-1 h-px bg-white/15" />
        </div>

        {/* Details row */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div
            className="rounded-2xl px-3 py-3"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1">
              תוקף
            </p>
            <p className="text-white font-semibold text-sm">שנה מיום הרכישה</p>
          </div>
          <div
            className="rounded-2xl px-3 py-3"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1">
              משלוח
            </p>
            <p className="text-white font-semibold text-sm">דיגיטלי · מיידי</p>
          </div>
        </div>

        {/* Bottom strip */}
        <div
          className="mt-6 rounded-2xl px-5 py-3 flex items-center justify-between gap-2"
          style={{ background: "rgba(253,214,42,0.12)", border: "1px solid rgba(253,214,42,0.25)" }}
        >
          <p className="text-white/70 text-xs">
            ניתן לשלוח בוואטסאפ או להדפיס
          </p>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-brand-green" />
            <div className="w-2 h-2 rounded-full bg-brand-sky" />
            <div className="w-2 h-2 rounded-full" style={{ background: "#FDD62A" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
