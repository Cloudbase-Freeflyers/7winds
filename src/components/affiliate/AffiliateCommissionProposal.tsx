"use client";

import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/constants";
import {
  AFFILIATE_SCENARIOS,
  CHART_DATA,
  COMMISSION_TIERS,
  PACKAGE_COMMISSION_EXAMPLES,
  VIP_EXAMPLES,
  VOLUME_BONUSES,
  commissionForBooking,
  commissionRateForValue,
  formatIls,
} from "@/lib/affiliate-commission";

const ACCENT = {
  sky: {
    bg: "bg-brand-sky/10",
    border: "border-brand-sky/30",
    text: "text-brand-sky",
    bar: "#1ABBEF",
  },
  green: {
    bg: "bg-brand-green/10",
    border: "border-brand-green/30",
    text: "text-brand-green",
    bar: "#8BC441",
  },
  yellow: {
    bg: "bg-brand-yellow/20",
    border: "border-brand-yellow/50",
    text: "text-brand-black",
    bar: "#FDD62A",
  },
} as const;

export default function AffiliateCommissionProposal() {
  const chartMax = Math.max(...CHART_DATA.map((d) => d.revenue));

  return (
    <div className="space-y-10 pb-16">
      {/* Hero */}
      <header className="relative overflow-hidden rounded-3xl bg-hero-radial text-white p-8 sm:p-10 ring-1 ring-white/10">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/v2/tandem-hero-bg.png"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
        <div className="relative z-10 max-w-2xl">
          <p className="text-brand-sky font-bold text-sm tracking-wide uppercase mb-2">
            תוכנית שותפים · {BRAND.name}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold leading-tight">
            מבנה עמלות שותפים
          </h1>
          <p className="mt-4 text-white/85 text-base sm:text-lg leading-relaxed">
            תוכנית עמלות מדורגת לעידוד הפניות, חבילות פרימיום ומכירות חודשיות
            עקביות — מותאמת לטיסות טנדם בישראל (₪).
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/affiliate/login" className="btn-primary btn-md">
              כניסת שותפים
            </Link>
            <a href="#scenarios" className="btn-outline btn-md">
              דוגמאות רווח
            </a>
          </div>
        </div>
      </header>

      {/* KPI strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard label="עמלה בסיסית" value="10–15%" hint="לפי ערך הזמנה" />
        <KpiCard label="בונוס חודשי" value="עד ₪2,000" hint="מעל ₪20K הכנסה" />
        <KpiCard label="ממוצע הזמנה" value="₪700–₪1,200" hint="טandem + שוברים" />
      </div>

      {/* Base commission */}
      <Section
        id="structure"
        title="מבנה עמלה בסיסי"
        subtitle="שיעור עמלה לפי ערך הזמנה בודד — מעודד הפניות לחבילות גבוהות יותר"
      >
        <div className="overflow-x-auto rounded-2xl ring-1 ring-black/5 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-soft border-b border-black/5">
                <Th>ערך הזמנה</Th>
                <Th>אחוז עמלה</Th>
                <Th>דוגמה — עמלה</Th>
              </tr>
            </thead>
            <tbody>
              {COMMISSION_TIERS.map((tier) => {
                const sample =
                  tier.max === 500 ? 450 : tier.max === 1000 ? 750 : 1500;
                return (
                  <tr key={tier.label} className="border-b border-black/5 last:border-0">
                    <Td>{tier.label}</Td>
                    <Td>
                      <RateBadge rate={tier.rate} />
                    </Td>
                    <Td className="font-bold text-brand-green">
                      {formatIls(commissionForBooking(sample))}{" "}
                      <span className="font-normal text-brand-dark/60">
                        (על {formatIls(sample)})
                      </span>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Performance bonus */}
      <Section
        id="bonuses"
        title="בונוס ביצועים חודשי"
        subtitle="בונוס נוסף מעל העמלה הרגילה — לפי סך ההכנסה שהופנתה בחודש (רמה הגבוהה ביותר שמגיעה)"
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {VOLUME_BONUSES.map((tier) => (
            <div
              key={tier.threshold}
              className="rounded-2xl bg-white p-5 ring-1 ring-black/5 shadow-sm text-center"
            >
              <p className="text-xs font-bold text-brand-dark/70 uppercase tracking-wide">
                הכנסה חודשית
              </p>
              <p className="font-display text-2xl font-extrabold mt-1">
                {tier.label}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-yellow/30 px-4 py-2">
                <span className="text-sm text-brand-dark">+ בונוס</span>
                <span className="font-display text-xl font-extrabold">
                  {formatIls(tier.bonus)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Commission dashboard */}
      <Section
        id="dashboard"
        title="לוח עמלות — מוצרי 7Winds"
        subtitle="כמה מרוויחים על כל מוצר בפועל"
      >
        <div className="overflow-x-auto rounded-2xl ring-1 ring-black/5 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-soft border-b border-black/5">
                <Th>מוצר / חבילה</Th>
                <Th>ערך הזמנה</Th>
                <Th>אחוז</Th>
                <Th>עמלה לשותף</Th>
              </tr>
            </thead>
            <tbody>
              {PACKAGE_COMMISSION_EXAMPLES.map((pkg) => {
                const rate = commissionRateForValue(pkg.value);
                const earned = commissionForBooking(pkg.value);
                return (
                  <tr key={pkg.package} className="border-b border-black/5">
                    <Td>{pkg.label}</Td>
                    <Td>{formatIls(pkg.value)}</Td>
                    <Td>
                      <RateBadge rate={rate} />
                    </Td>
                    <Td className="font-bold text-brand-green">{formatIls(earned)}</Td>
                  </tr>
                );
              })}
              {VIP_EXAMPLES.map((vip) => {
                const rate = commissionRateForValue(vip.value);
                const earned = commissionForBooking(vip.value);
                return (
                  <tr
                    key={vip.label}
                    className="border-b border-black/5 last:border-0 bg-brand-yellow/5"
                  >
                    <Td>
                      <span className="font-bold">{vip.label}</span>
                      <span className="ms-2 text-xs rounded-full bg-brand-yellow/40 px-2 py-0.5">
                        VIP
                      </span>
                    </Td>
                    <Td>{formatIls(vip.value)}</Td>
                    <Td>
                      <RateBadge rate={rate} />
                    </Td>
                    <Td className="font-bold text-brand-green">{formatIls(earned)}</Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Monthly performance dashboard template */}
      <Section
        title="לוח ביצועים חודשי — תבנית"
        subtitle="סיכום חודשי לכל שותף"
      >
        <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm overflow-hidden">
          <div className="grid sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-black/5">
            <PerfCell
              label="הכנסה שהופנתה"
              value={formatIls(AFFILIATE_SCENARIOS[1].monthlyRevenue)}
              accent
            />
            <PerfCell
              label="עמלות בסיס"
              value={formatIls(AFFILIATE_SCENARIOS[1].commission)}
            />
            <PerfCell
              label="בונוס חודשי"
              value={formatIls(AFFILIATE_SCENARIOS[1].bonus)}
              highlight
            />
            <PerfCell
              label="סה״כ לתשלום"
              value={formatIls(AFFILIATE_SCENARIOS[1].totalPayout)}
              total
            />
          </div>
          <p className="px-5 py-3 text-xs text-brand-dark/60 bg-brand-soft border-t border-black/5">
            * דוגמה לשותף פעיל — חישוב אוטומטי בלוח השותפים
          </p>
        </div>
      </Section>

      {/* Scenarios */}
      <Section
        id="scenarios"
        title="תרחישי רווח — 3 דוגמאות"
        subtitle="חישוב מדויק לפי תמהיל הזמנות אמיתי של 7Winds"
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {AFFILIATE_SCENARIOS.map((scenario) => {
            const accent = ACCENT[scenario.accent];
            return (
              <article
                key={scenario.id}
                className={`rounded-2xl border ${accent.border} ${accent.bg} p-6 flex flex-col`}
              >
                <div>
                  <h3 className={`font-display text-xl font-extrabold ${accent.text}`}>
                    {scenario.title}
                  </h3>
                  <p className="text-sm text-brand-dark mt-1">{scenario.subtitle}</p>
                </div>

                <ul className="mt-4 space-y-1.5 text-sm text-brand-dark flex-1">
                  {scenario.bookings.map((b) => (
                    <li key={b.label} className="flex justify-between gap-2">
                      <span>
                        {b.count}× {b.label}
                      </span>
                      <span className="font-mono text-xs shrink-0" dir="ltr">
                        {formatIls(b.value * b.count)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 pt-4 border-t border-black/10 space-y-2 text-sm">
                  <Row label="הכנסה חודשית" value={formatIls(scenario.monthlyRevenue)} />
                  <Row label="עמלות" value={formatIls(scenario.commission)} />
                  <Row
                    label="בונוס"
                    value={scenario.bonus ? formatIls(scenario.bonus) : "—"}
                    highlight={scenario.bonus > 0}
                  />
                  <Row
                    label="סה״כ לתשלום"
                    value={formatIls(scenario.totalPayout)}
                    bold
                  />
                </div>
              </article>
            );
          })}
        </div>
      </Section>

      {/* Chart */}
      <Section
        id="chart"
        title="צמיחת רווח לפי נפח"
        subtitle="הכנסה מול עמלה, בונוס וסה״כ תשלום — 3 רמות שותפים"
      >
        <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-6 sm:p-8">
          <div className="flex flex-wrap gap-4 mb-8 text-xs font-bold">
            <Legend color="#1ABBEF" label="הכנסה שהופנתה" />
            <Legend color="#8BC441" label="עמלות" />
            <Legend color="#FDD62A" label="בונוס" />
            <Legend color="#050606" label="סה״כ לשותף" />
          </div>

          <div className="space-y-6">
            {CHART_DATA.map((row) => (
              <div key={row.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold">{row.label}</span>
                  <span className="text-brand-dark/70">{formatIls(row.revenue)}</span>
                </div>
                <div className="space-y-1.5">
                  <Bar label="הכנסה" value={row.revenue} max={chartMax} color="#1ABBEF" />
                  <Bar label="עמלות" value={row.commission} max={chartMax} color="#8BC441" />
                  <Bar label="בונוס" value={row.bonus} max={chartMax} color="#FDD62A" />
                  <Bar label="סה״כ" value={row.total} max={chartMax} color="#050606" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Recommendation */}
      <Section
        id="recommendation"
        title="המלצה אסטרטגית"
        subtitle="מותאם ל-7Winds — ממוצע הזמנה ₪700–₪1,200, צמיחה אגרסיבית עם שמירה על מרווחים"
      >
        <div className="rounded-2xl bg-sky-gradient p-[2px]">
          <div className="rounded-[14px] bg-white p-6 sm:p-8 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <RecBlock
                title="למה המבנה הזה?"
                items={[
                  "10% על הזמנות קטנות (₪300–₪500) — מרווח בריא על טיסות ארסוף",
                  "12% על טנדם צפון (₪750) — מניעה להפנות לחבילות עיקריות",
                  "15% על VIP/קבוצות (₪1,001+) — תמריץ לשוברים משולבים וקבוצות",
                ]}
              />
              <RecBlock
                title="יתרונות לעסק"
                items={[
                  "עלות שיווק משתנה (CPA) — משלמים רק על מכירה",
                  'בונוסים מדורגים מונעים "שחיקה" של שותפים פעילים',
                  "מרווח גולמי נשמר גם ב-15% על חבילות ₪2,500+",
                ]}
              />
            </div>

            <div className="rounded-xl bg-brand-soft p-5 border border-brand-sky/20">
              <p className="font-display font-extrabold text-lg mb-2">
                סיכום מומלץ
              </p>
              <p className="text-brand-dark leading-relaxed text-sm sm:text-base">
                עבור 7Winds, מבנה של{" "}
                <strong>10% / 12% / 15%</strong> עם בונוסים חודשיים של{" "}
                <strong>₪250 / ₪750 / ₪2,000</strong> מספק תמריץ חזק לשותפים
                תוכן, מדריכים ומלונות — תוך שמירה על רווחיות. שותף שמפנה 8 טיסות
                טנדם בחודש (≈{formatIls(AFFILIATE_SCENARIOS[1].monthlyRevenue)}) מרוויח כ-
                <strong>{formatIls(AFFILIATE_SCENARIOS[1].totalPayout)}</strong>; שותף
                מוביל (₪25,000+) מגיע ל-
                <strong>{formatIls(AFFILIATE_SCENARIOS[2].totalPayout)}+</strong> בחודש.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/affiliate/login" className="btn-secondary btn-md">
                הצטרפות לתוכנית
              </Link>
              <Link href="/#pricing" className="btn-primary btn-md">
                צפייה במחירון
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <footer className="text-center text-xs text-brand-dark/50 pt-4">
        {BRAND.hebrewName} · מסמך פנימי / הצעה לשותפים · {new Date().getFullYear()}
      </footer>
    </div>
  );
}

function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8">
      <div className="mb-5">
        <h2 className="font-display text-2xl font-extrabold">{title}</h2>
        {subtitle && (
          <p className="text-brand-dark/70 mt-1 text-sm sm:text-base">{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function KpiCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-black/5 shadow-sm">
      <p className="text-xs font-bold text-brand-dark/60 uppercase tracking-wide">
        {label}
      </p>
      <p className="font-display text-2xl font-extrabold mt-1">{value}</p>
      <p className="text-xs text-brand-dark/50 mt-1">{hint}</p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-start px-4 py-3 font-bold text-brand-dark text-xs uppercase tracking-wide">
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}

function RateBadge({ rate }: { rate: number }) {
  return (
    <span className="inline-flex rounded-full bg-brand-sky/15 text-brand-sky font-bold px-2.5 py-0.5 text-xs">
      {rate}%
    </span>
  );
}

function PerfCell({
  label,
  value,
  accent,
  highlight,
  total,
}: {
  label: string;
  value: string;
  accent?: boolean;
  highlight?: boolean;
  total?: boolean;
}) {
  return (
    <div
      className={`p-5 text-center ${
        total ? "bg-brand-black text-white" : highlight ? "bg-brand-yellow/15" : ""
      }`}
    >
      <p
        className={`text-xs font-bold uppercase tracking-wide ${
          total ? "text-white/70" : "text-brand-dark/60"
        }`}
      >
        {label}
      </p>
      <p
        className={`font-display text-2xl font-extrabold mt-1 ${
          accent ? "text-brand-sky" : highlight ? "text-brand-black" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  highlight,
}: {
  label: string;
  value: string;
  bold?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className={`flex justify-between ${bold ? "font-extrabold text-base pt-1" : ""}`}>
      <span className={highlight ? "text-brand-green font-bold" : ""}>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="w-3 h-3 rounded-sm shrink-0"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}

function Bar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = max > 0 ? Math.max(2, (value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-12 text-[10px] text-brand-dark/60 shrink-0">{label}</span>
      <div className="flex-1 h-5 bg-brand-soft rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-16 text-xs font-mono text-end shrink-0" dir="ltr">
        {formatIls(value)}
      </span>
    </div>
  );
}

function RecBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="font-display font-extrabold mb-3">{title}</h4>
      <ul className="space-y-2 text-sm text-brand-dark">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-brand-green shrink-0">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
