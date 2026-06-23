"use client";

import Image from "next/image";
import Link from "next/link";
import AffiliateCommissionCalculator from "@/components/affiliate/AffiliateCommissionCalculator";
import { BRAND } from "@/lib/constants";
import {
  AFFILIATE_PRICING_POLICY,
  AFFILIATE_SCENARIOS,
  CHART_DATA,
  GROUP_DEAL_COMMISSION_EXAMPLE,
  GROUP_RATE,
  PACKAGE_COMMISSION_EXAMPLES,
  VOLUME_RATE_TIERS,
  formatIls,
} from "@/lib/affiliate-commission";

const ACCENT = {
  sky: {
    bg: "bg-brand-sky/10",
    border: "border-brand-sky/30",
    text: "text-brand-sky",
  },
  green: {
    bg: "bg-brand-green/10",
    border: "border-brand-green/30",
    text: "text-brand-green",
  },
  yellow: {
    bg: "bg-brand-yellow/20",
    border: "border-brand-yellow/50",
    text: "text-brand-black",
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
            עמלה מדורגת לפי מחזור מכירות חודשי — ככל שמפנים יותר, השיעור עולה.
            מותאם לטיסות טנדם בישראל (₪).
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/affiliate/login" className="btn-primary btn-md">
              כניסת שותפים
            </Link>
            <a href="#calculator" className="btn-outline btn-md">
              מחשבון עמלה
            </a>
            <a href="#policy" className="btn-outline btn-md">
              מדיניות מחיר
            </a>
            <a href="#scenarios" className="btn-outline btn-md">
              דוגמאות רווח
            </a>
          </div>
        </div>
      </header>

      {/* KPI strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard label="שיעור התחלתי" value="10%" hint="עד ₪2,000 מכירות בחודש" />
        <KpiCard label="שיעור ביניים" value="12%" hint="₪2,000–₪5,000 בחודש" />
        <KpiCard label="שיעור מוביל" value="15%" hint="מעל ₪5,000 בחודש" />
      </div>

      {/* Volume tiers */}
      <Section
        id="structure"
        title="מבנה עמלה לפי מחזור חודשי"
        subtitle="השיעור נקבע לפי סך המכירות ששולמו בפועל והופנו על ידך באותו חודש — ומתאפס בכל תחילת חודש"
      >
        <div className="overflow-x-auto rounded-2xl ring-1 ring-black/5 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-soft border-b border-black/5">
                <Th>מחזור חודשי</Th>
                <Th>שיעור עמלה</Th>
                <Th>דוגמה — עמלה</Th>
              </tr>
            </thead>
            <tbody>
              {VOLUME_RATE_TIERS.map((tier) => {
                const sample = tier.max === Infinity ? 8_000 : tier.max;
                return (
                  <tr key={tier.label} className="border-b border-black/5 last:border-0">
                    <Td>{tier.label}</Td>
                    <Td>
                      <RateBadge rate={tier.rate} />
                    </Td>
                    <Td className="font-bold text-brand-green">
                      {formatIls(Math.round(sample * (tier.rate / 100)))}{" "}
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

      {/* Package price reference */}
      <Section
        id="dashboard"
        title="מחירון מוצרים — בסיס לחישוב"
        subtitle="מחירי מחירון ליחידה — לצורך הערכה בלבד. בפועל נספר הסכום ששולם לאחר הנחות."
      >
        <div className="overflow-x-auto rounded-2xl ring-1 ring-black/5 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-soft border-b border-black/5">
                <Th>מוצר / חבילה</Th>
                <Th>מחיר מחירון</Th>
                <Th>עמלה ב-10%</Th>
                <Th>עמלה ב-12%</Th>
                <Th>עמלה ב-15%</Th>
              </tr>
            </thead>
            <tbody>
              {PACKAGE_COMMISSION_EXAMPLES.map((pkg) => (
                <tr key={pkg.package} className="border-b border-black/5 last:border-0">
                  <Td>{pkg.label}</Td>
                  <Td>{formatIls(pkg.value)}</Td>
                  <Td className="text-brand-dark">{formatIls(Math.round(pkg.value * 0.1))}</Td>
                  <Td className="text-brand-dark">{formatIls(Math.round(pkg.value * 0.12))}</Td>
                  <Td className="font-bold text-brand-green">
                    {formatIls(Math.round(pkg.value * 0.15))}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Pricing & commission basis policy */}
      <Section
        id="policy"
        title={AFFILIATE_PRICING_POLICY.title}
        subtitle={AFFILIATE_PRICING_POLICY.intro}
      >
        <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-6 space-y-5">
          <ul className="space-y-2 text-sm text-brand-dark">
            {AFFILIATE_PRICING_POLICY.bullets.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-brand-sky shrink-0 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="rounded-xl border border-brand-yellow/40 bg-brand-yellow/10 p-5">
            <p className="font-display font-extrabold text-brand-black mb-3">
              דוגמה — הזמנה קבוצתית של {GROUP_DEAL_COMMISSION_EXAMPLE.flightCount} טיסות
            </p>
            <p className="text-sm text-brand-dark mb-4">
              {GROUP_DEAL_COMMISSION_EXAMPLE.flightCount}×{" "}
              {GROUP_DEAL_COMMISSION_EXAMPLE.packageLabel}: מחיר מחירון{" "}
              {formatIls(GROUP_DEAL_COMMISSION_EXAMPLE.listTotal)}, אך לאחר הנחת
              קבוצה (צילום חינם לכל טיסה) הלקוח משלם{" "}
              <strong>{formatIls(GROUP_DEAL_COMMISSION_EXAMPLE.paidTotal)}</strong>.
              העמלה מחושבת על הסכום ששולם בפועל.
            </p>
            <div className="overflow-x-auto rounded-xl ring-1 ring-black/5 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-brand-soft border-b border-black/5">
                    <Th>בסיס חישוב</Th>
                    <Th>סכום</Th>
                    <Th>עמלה ב-10%</Th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-black/5">
                    <Td>מחיר מחירון (ללא הנחה)</Td>
                    <Td>{formatIls(GROUP_DEAL_COMMISSION_EXAMPLE.listTotal)}</Td>
                    <Td className="text-brand-dark/50 line-through">
                      {formatIls(GROUP_DEAL_COMMISSION_EXAMPLE.commissionAtList10)}{" "}
                      — לא רלוונטי
                    </Td>
                  </tr>
                  <tr>
                    <Td className="font-bold">סכום ששולם בפועל</Td>
                    <Td className="font-bold text-brand-green">
                      {formatIls(GROUP_DEAL_COMMISSION_EXAMPLE.paidTotal)}
                    </Td>
                    <Td className="font-bold text-brand-green">
                      {formatIls(GROUP_DEAL_COMMISSION_EXAMPLE.commissionAt10)}
                    </Td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Section>

      {/* Commission calculator */}
      <Section
        id="calculator"
        title="מחשבון עמלה"
        subtitle="הוסיפו הזמנות עם הנחות קבוצתיות — ראו כמה תרוויחו לפי מחזור חודשי"
      >
        <AffiliateCommissionCalculator />
      </Section>

      {/* Group rate */}
      <Section
        title="מחיר מיוחד לקבוצות"
        subtitle="הזמנות קבוצתיות באתר (מ-3 טיסות) — הנחות אוטומטיות. קבוצות גדולות (50+) — תיאום אישי."
      >
        <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-lg font-extrabold">
              קבוצות של {GROUP_RATE.minParticipants}–{GROUP_RATE.maxParticipants} משתתפים
            </p>
            <p className="mt-1 text-sm text-brand-dark">
              מחיר סוכן לטיסת חוויה 10 דקות — למשתתף
            </p>
          </div>
          <p className="font-display text-3xl font-extrabold text-brand-sky">
            {formatIls(GROUP_RATE.agentPricePerPerson)}
          </p>
        </div>
      </Section>

      {/* Scenarios */}
      <Section
        id="scenarios"
        title="תרחישי רווח — 3 דוגמאות"
        subtitle="חישוב מדויק לפי מחזור חודשי והשיעור המתאים לו"
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
                  <Row label="מחזור חודשי" value={formatIls(scenario.monthlyRevenue)} />
                  <Row label="שיעור עמלה" value={`${scenario.rate}%`} highlight />
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
        subtitle="מחזור מול עמלה — 3 רמות שותפים"
      >
        <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-6 sm:p-8">
          <div className="flex flex-wrap gap-4 mb-8 text-xs font-bold">
            <Legend color="#1ABBEF" label="מחזור שהופנה" />
            <Legend color="#8BC441" label="עמלה לשותף" />
          </div>

          <div className="space-y-6">
            {CHART_DATA.map((row) => (
              <div key={row.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold">{row.label}</span>
                  <span className="text-brand-dark/70">{formatIls(row.revenue)}</span>
                </div>
                <div className="space-y-1.5">
                  <Bar label="מחזור" value={row.revenue} max={chartMax} color="#1ABBEF" />
                  <Bar label="עמלה" value={row.commission} max={chartMax} color="#8BC441" />
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
                title="למה מבנה לפי מחזור?"
                items={[
                  "פשוט וברור — שיעור אחד לחודש לפי סך המכירות",
                  "מתגמל צמיחה — 12% מעל ₪2,000, 15% מעל ₪5,000",
                  "מעודד שותפים להפנות באופן עקבי לאורך החודש",
                ]}
              />
              <RecBlock
                title="יתרונות לעסק"
                items={[
                  "עלות שיווק משתנה (CPA) — משלמים רק על מכירה ששולמה",
                  "מרווח גולמי נשמר גם בשיעור 15%",
                  "אין בונוסים כפולים לעקוב אחריהם — חישוב חודשי אחד",
                ]}
              />
            </div>

            <div className="rounded-xl bg-brand-soft p-5 border border-brand-sky/20">
              <p className="font-display font-extrabold text-lg mb-2">סיכום מומלץ</p>
              <p className="text-brand-dark leading-relaxed text-sm sm:text-base">
                עבור 7Winds, שיעור עמלה מדורג לפי מחזור חודשי —{" "}
                <strong>10% / 12% / 15%</strong> בספים של{" "}
                <strong>₪2,000</strong> ו-<strong>₪5,000</strong> — מספק תמריץ חזק
                לשותפי תוכן, מדריכים ומלונות תוך שמירה על רווחיות. שותף שמפנה כ-
                {formatIls(AFFILIATE_SCENARIOS[1].monthlyRevenue)} בחודש מרוויח כ-
                <strong>{formatIls(AFFILIATE_SCENARIOS[1].totalPayout)}</strong>; שותף
                מוביל ({formatIls(AFFILIATE_SCENARIOS[2].monthlyRevenue)}+) מגיע ל-
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
        {BRAND.hebrewName} · מסמך פנימי / הצעה לשותפים
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
