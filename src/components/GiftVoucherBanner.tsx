type Props = {
  variant?: "hero" | "form";
  className?: string;
};

export default function GiftVoucherBanner({
  variant = "form",
  className = "",
}: Props) {
  if (variant === "hero") {
    return (
      <p
        className={`rounded-2xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20 px-4 py-3 text-sm text-white/90 ${className}`}
      >
        🎁 מחפשים לרכוש טיסה במתנה?{" "}
        <a
          href="#voucher"
          className="font-bold text-brand-yellow underline underline-offset-2 hover:brightness-110 transition"
        >
          לחצו כאן
        </a>{" "}
        לרכישת שובר מתנה.
      </p>
    );
  }

  return (
    <div
      className={`rounded-2xl bg-brand-yellow/20 border border-brand-yellow/40 px-4 py-3 text-sm text-brand-black ${className}`}
    >
      🎁 מחפשים לרכוש טיסה במתנה?{" "}
      <a
        href="#voucher"
        className="font-bold text-brand-sky underline hover:brightness-110"
      >
        לחצו כאן
      </a>{" "}
      לרכישת שובר מתנה.
    </div>
  );
}
