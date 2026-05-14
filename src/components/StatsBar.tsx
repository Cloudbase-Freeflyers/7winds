const STATS = [
  { value: "3,000+", label: "טיסות בוצעו" },
  { value: "15+",    label: "שנות ניסיון" },
  { value: "4",      label: "אתרי טיסה בארץ" },
  { value: "98%",    label: "ממליצים לחברים" },
];

export default function StatsBar() {
  return (
    <section className="bg-white border-y border-black/5">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0 sm:divide-x sm:divide-x-reverse divide-black/8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center px-4">
              <div className="font-display font-extrabold text-2xl sm:text-3xl text-brand-sky">
                {s.value}
              </div>
              <div className="mt-0.5 text-sm text-brand-dark font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
