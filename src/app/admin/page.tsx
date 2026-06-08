import { headers } from "next/headers";
import AdminNav from "@/components/admin/AdminNav";
import MarketingPageLinks from "@/components/admin/MarketingPageLinks";
import { absoluteUrl, loadDashboardData } from "@/lib/admin-dashboard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "לוח בקרה",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  await headers();
  const data = await loadDashboardData();

  return (
    <div className="min-h-screen bg-brand-soft text-brand-black" dir="rtl">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-extrabold">לוח בקרה</h1>
            <p className="text-brand-dark text-sm">
              סקירה כללית, שותפים וקישורים לכל דפי השיווק.
            </p>
          </div>
          <AdminNav active="dashboard" />
        </header>

        {data.error && (
          <div className="mt-6 rounded-2xl bg-red-50 border border-red-200 p-4 text-red-800">
            <p className="font-bold">שגיאה בטעינת נתונים</p>
            <p className="mt-1 text-sm">{data.error}</p>
            <p className="mt-2 text-xs">
              ודאו שמשתנה הסביבה <code>MONGODB_URI</code> מוגדר.
            </p>
          </div>
        )}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="לידים" value={data.totals.leads} sub={`${data.totals.affiliateLeads} דרך שותפים`} />
          <StatCard label="בקשות שובר" value={data.totals.vouchers} sub={`${data.totals.affiliateVouchers} דרך שותפים`} />
          <StatCard label="ביקורי שותפים" value={data.totals.visits} sub={`${data.totals.activeAffiliates} שותפים פעילים`} />
          <StatCard label="ממתינים לתשלום" value={data.totals.pendingPayouts} sub="שותפים עם יתרה" highlight={data.totals.pendingPayouts > 0} />
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
                    <Th>לידים</Th>
                    <Th>דף</Th>
                  </tr>
                </thead>
                <tbody>
                  {data.affiliates.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-3 py-6 text-center text-brand-dark">
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
                      <Td>{a.stats.leads}</Td>
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
          <h2 className="font-display text-xl font-extrabold">קישורים מהירים</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href={absoluteUrl("/")} target="_blank" rel="noopener" className="btn-primary btn-md">
              דף הבית ↗
            </a>
            <a href="/admin/leads" className="btn-secondary btn-md">
              לידים ושוברים
            </a>
            <a href="/admin/affiliates" className="btn-secondary btn-md">
              ניהול שותפים + QR
            </a>
            <a href="/api/admin/list?type=leads&format=csv" className="btn-secondary btn-md">
              ייצוא לידים CSV
            </a>
            <a href="/api/admin/list?type=vouchers&format=csv" className="btn-secondary btn-md">
              ייצוא שוברים CSV
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: number;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-5 shadow-sm ring-1 ${
        highlight
          ? "bg-brand-sky/10 ring-brand-sky/20"
          : "bg-white ring-black/5"
      }`}
    >
      <p className="text-sm text-brand-dark">{label}</p>
      <p className="mt-1 font-display text-3xl font-extrabold">{value}</p>
      <p className="mt-1 text-xs text-brand-dark">{sub}</p>
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

function Td({ children, ...rest }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td {...rest} className="px-3 py-3 align-top text-brand-black">
      {children}
    </td>
  );
}
