import { headers } from "next/headers";
import AdminShell from "@/components/admin/AdminShell";
import MarketingPageLinks from "@/components/admin/MarketingPageLinks";
import { SYSTEM_PAGES, absoluteUrl, loadDashboardData } from "@/lib/admin-dashboard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "לוח בקרה",
  robots: { index: false, follow: false },
};

function ils(n: number) {
  return `₪${n.toLocaleString("he-IL")}`;
}

export default async function AdminDashboardPage() {
  await headers();
  const data = await loadDashboardData();

  return (
    <AdminShell
      active="dashboard"
      title="לוח בקרה"
      subtitle="סקירה כללית, הכנסות, שותפים וקישורים לכל דפי השיווק."
      actions={
        <a href={absoluteUrl("/")} target="_blank" rel="noopener" className="btn-primary btn-sm">
          דף הבית ↗
        </a>
      }
    >
      {data.error && (
        <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 p-4 text-red-800">
          <p className="font-bold">שגיאה בטעינת נתונים</p>
          <p className="mt-1 text-sm">{data.error}</p>
          <p className="mt-2 text-xs">
            ודאו שמשתנה הסביבה <code>MONGODB_URI</code> מוגדר.
          </p>
        </div>
      )}

      {/* Funnel KPIs */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon="📥" label="לידים" value={data.totals.leads} sub={`${data.totals.affiliateLeads} דרך שותפים`} />
        <StatCard icon="🎁" label="בקשות שובר" value={data.totals.vouchers} sub={`${data.totals.affiliateVouchers} דרך שותפים`} />
        <StatCard icon="👁️" label="ביקורי שותפים" value={data.totals.visits} sub={`${data.totals.activeAffiliates} שותפים פעילים`} />
        <StatCard icon="💸" label="ממתינים לתשלום" value={data.totals.pendingPayouts} sub="שותפים עם יתרה" highlight={data.totals.pendingPayouts > 0} />
      </section>

      {/* Revenue & commissions */}
      <section className="mt-8 rounded-2xl bg-sky-gradient p-[2px] shadow-sm">
        <div className="rounded-[14px] bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-extrabold">הכנסות ועמלות</h2>
            <span className="text-xs text-brand-dark/60">מבוסס על מכירות ששולמו</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <MoneyCard label="הכנסה ששולמה" value={ils(data.revenue.paidRevenue)} accent />
            <MoneyCard label="הזמנות ששולמו" value={String(data.revenue.paidOrders)} />
            <MoneyCard label="עמלות שנצברו" value={ils(data.revenue.commissionOwed)} />
            <MoneyCard label="שולם לשותפים" value={ils(data.revenue.commissionPaid)} />
            <MoneyCard
              label="יתרה לתשלום"
              value={ils(data.revenue.commissionPending)}
              highlight={data.revenue.commissionPending > 0}
            />
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-extrabold">שותפים</h2>
            <a href="/admin/affiliates" className="btn-secondary btn-sm">
              ניהול שותפים →
            </a>
          </div>
          <p className="mt-1 text-sm text-brand-dark">
            ביצועים וקישורים לדפי נחיתה של שותפים.
          </p>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-brand-soft text-brand-dark">
                <tr>
                  <Th>שם</Th>
                  <Th>קוד</Th>
                  <Th>סטטוס</Th>
                  <Th>ביקורים</Th>
                  <Th>מכירות</Th>
                  <Th>עמלה</Th>
                  <Th>דף</Th>
                </tr>
              </thead>
              <tbody>
                {data.affiliates.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-3 py-6 text-center text-brand-dark">
                      אין שותפים עדיין —{" "}
                      <a href="/admin/affiliates" className="text-brand-sky font-bold underline">
                        צרו שותף ראשון
                      </a>
                    </td>
                  </tr>
                )}
                {data.affiliates.map((a) => (
                  <tr key={a._id} className="border-t border-black/5">
                    <Td>{a.name}</Td>
                    <Td dir="ltr" className="font-mono text-xs">
                      {a.code}
                    </Td>
                    <Td>
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold ${
                          a.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {a.status === "active" ? "פעיל" : "מושבת"}
                      </span>
                    </Td>
                    <Td>{a.stats.visits}</Td>
                    <Td>{a.stats.paidOrders}</Td>
                    <Td className="font-bold text-brand-green">₪{a.stats.estimatedEarnings}</Td>
                    <Td>
                      <a
                        href={a.url}
                        target="_blank"
                        rel="noopener"
                        className="text-brand-sky font-bold hover:underline"
                      >
                        פתח ↗
                      </a>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-5">
          <h2 className="font-display text-xl font-extrabold">דפי שיווק</h2>
          <p className="mt-1 text-sm text-brand-dark">
            כל דפי הנחיתה והסקשנים הזמינים לשיתוף.
          </p>
          <div className="mt-4">
            <MarketingPageLinks pages={data.marketingPages} siteUrl={data.siteUrl} />
          </div>
        </section>
      </div>

      <section className="mt-8 rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-5">
        <h2 className="font-display text-xl font-extrabold">כל דפי המערכת</h2>
        <p className="mt-1 text-sm text-brand-dark">
          ניווט מהיר לכל דפי הניהול והפורטלים.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {SYSTEM_PAGES.map((page) => (
            <a
              key={page.id}
              href={page.path}
              className="flex items-center justify-between gap-2 rounded-xl bg-brand-soft px-4 py-3 hover:bg-brand-sky/10 transition-colors"
            >
              <span className="min-w-0">
                <span className="block font-bold text-sm truncate">{page.label}</span>
                {page.description && (
                  <span className="block text-xs text-brand-dark/70 truncate">
                    {page.description}
                  </span>
                )}
              </span>
              <span className="text-xs text-brand-dark font-mono shrink-0" dir="ltr">
                {page.path}
              </span>
            </a>
          ))}
        </div>

        <h3 className="mt-6 text-sm font-bold text-brand-dark">ייצוא נתונים</h3>
        <div className="mt-3 flex flex-wrap gap-3">
          <a href="/api/admin/list?type=leads&format=csv" className="btn-secondary btn-sm">
            ייצוא לידים CSV
          </a>
          <a href="/api/admin/list?type=vouchers&format=csv" className="btn-secondary btn-sm">
            ייצוא שוברים CSV
          </a>
        </div>
      </section>
    </AdminShell>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  highlight,
}: {
  icon: string;
  label: string;
  value: number;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-5 shadow-sm ring-1 ${
        highlight ? "bg-brand-sky/10 ring-brand-sky/20" : "bg-white ring-black/5"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-brand-dark">{label}</p>
        <span className="text-lg" aria-hidden>{icon}</span>
      </div>
      <p className="mt-1 font-display text-3xl font-extrabold">{value}</p>
      <p className="mt-1 text-xs text-brand-dark">{sub}</p>
    </div>
  );
}

function MoneyCard({
  label,
  value,
  accent,
  highlight,
}: {
  label: string;
  value: string;
  accent?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl px-4 py-3 ring-1 ${
        highlight
          ? "bg-brand-yellow/15 ring-brand-yellow/40"
          : accent
          ? "bg-brand-sky/10 ring-brand-sky/20"
          : "bg-brand-soft ring-black/5"
      }`}
    >
      <p className="text-xs font-bold text-brand-dark/70">{label}</p>
      <p className={`mt-1 font-display text-xl font-extrabold ${accent ? "text-brand-sky" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-3 py-3 text-start text-xs font-bold uppercase tracking-wide">
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
  ...rest
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td {...rest} className={`px-3 py-3 align-top text-brand-black ${className}`}>
      {children}
    </td>
  );
}
