import { VIRAL_LINES } from "@/lib/constants";

export default function ViralCopy() {
  const repeated = [...VIRAL_LINES, ...VIRAL_LINES, ...VIRAL_LINES];

  return (
    <section
      aria-label="צ'ופרים ויראליים"
      className="bg-sky-gradient text-white py-6 overflow-hidden"
    >
      <div className="flex w-max animate-marquee gap-10 px-6 text-lg sm:text-xl font-display font-extrabold">
        {repeated.map((line, i) => (
          <span key={i} className="whitespace-nowrap">
            {line}
            <span className="mx-6 opacity-50">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}
