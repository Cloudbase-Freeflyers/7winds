import Image from "next/image";
import Link from "next/link";

const NAV = [
  { href: "#pricing", label: "מחירים" },
  { href: "#experience", label: "החוויה" },
  { href: "#voucher", label: "שוברי מתנה" },
  { href: "#accessibility", label: "נגישות" },
  { href: "#booking", label: "קביעת טיסה" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-black/5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-5 sm:px-8 py-3">
        <Link href="#top" className="flex items-center gap-3" aria-label="7Winds">
          <Image
            src="/logo.png"
            alt="7Winds Paragliding Club"
            width={140}
            height={48}
            priority
            className="h-10 w-auto"
          />
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-brand-dark">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-brand-sky transition"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <a href="#booking" className="btn btn-primary btn-md hidden sm:inline-flex">
          קבעו טיסה
        </a>
      </div>
    </header>
  );
}
