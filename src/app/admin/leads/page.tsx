import { headers } from "next/headers";
import AdminNav from "@/components/admin/AdminNav";
import { getDb } from "@/lib/mongodb";
import type { LeadDoc, VoucherDoc } from "@/types/submissions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "ניהול פניות",
  robots: { index: false, follow: false },
};

async function loadRows() {
  try {
    const db = await getDb();
    const [leads, vouchers] = await Promise.all([
      db
        .collection<LeadDoc>("leads")
        .find({})
        .sort({ createdAt: -1 })
        .limit(100)
        .toArray(),
      db
        .collection<VoucherDoc>("vouchers")
        .find({})
        .sort({ createdAt: -1 })
        .limit(100)
        .toArray(),
    ]);
    return { leads, vouchers, error: null as string | null };
  } catch (err) {
    return {
      leads: [] as LeadDoc[],
      vouchers: [] as VoucherDoc[],
      error: err instanceof Error ? err.message : "Failed to load",
    };
  }
}

export default async function AdminLeadsPage() {
  await headers();
  const { leads, vouchers, error } = await loadRows();

  return (
    <div className="min-h-screen bg-brand-soft text-brand-black" dir="rtl">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-extrabold">לידים ושוברים</h1>
            <p className="text-brand-dark text-sm">
              100 הרשומות האחרונות בכל קטגוריה.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <AdminNav active="leads" />
            <a className="btn-secondary btn-md" href="/api/admin/list?type=leads&format=csv">
              ייצוא לידים CSV
            </a>
            <a
              className="btn-secondary btn-md"
              href="/api/admin/list?type=vouchers&format=csv"
            >
              ייצוא שוברים CSV
            </a>
          </div>
        </header>

        {error && (
          <div className="mt-6 rounded-2xl bg-red-50 border border-red-200 p-4 text-red-800">
            <p className="font-bold">שגיאה בטעינת נתונים</p>
            <p className="mt-1 text-sm">{error}</p>
            <p className="mt-2 text-xs">
              ודאו שמשתנה הסביבה <code>MONGODB_URI</code> מוגדר.
            </p>
          </div>
        )}

        <section className="mt-8">
          <h2 className="font-display text-xl font-extrabold">לידים ({leads.length})</h2>
          <div className="mt-3 overflow-x-auto rounded-2xl bg-white ring-1 ring-black/5 shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-brand-soft text-brand-dark">
                <tr>
                  <Th>תאריך</Th>
                  <Th>שם</Th>
                  <Th>טלפון</Th>
                  <Th>הודעה</Th>
                  <Th>מקור</Th>
                  <Th>שותף</Th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-brand-dark">
                      אין לידים עדיין
                    </td>
                  </tr>
                )}
                {leads.map((l) => (
                  <tr key={String(l._id)} className="border-t border-black/5">
                    <Td>{formatDate(l.createdAt)}</Td>
                    <Td>{l.name}</Td>
                    <Td dir="ltr">{l.phone}</Td>
                    <Td>{l.message || "—"}</Td>
                    <Td>{l.source}</Td>
                    <Td dir="ltr">{l.affiliateCode || "—"}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-xl font-extrabold">
            בקשות שובר ({vouchers.length})
          </h2>
          <div className="mt-3 overflow-x-auto rounded-2xl bg-white ring-1 ring-black/5 shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-brand-soft text-brand-dark">
                <tr>
                  <Th>תאריך</Th>
                  <Th>קונה</Th>
                  <Th>טלפון</Th>
                  <Th>מקבל</Th>
                  <Th>אירוע</Th>
                  <Th>מסלול</Th>
                  <Th>הערות</Th>
                  <Th>שותף</Th>
                </tr>
              </thead>
              <tbody>
                {vouchers.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-brand-dark">
                      אין בקשות שובר עדיין
                    </td>
                  </tr>
                )}
                {vouchers.map((v) => (
                  <tr key={String(v._id)} className="border-t border-black/5">
                    <Td>{formatDate(v.createdAt)}</Td>
                    <Td>{v.buyerName}</Td>
                    <Td dir="ltr">{v.buyerPhone}</Td>
                    <Td>{v.recipientName || "—"}</Td>
                    <Td>{v.occasion || "—"}</Td>
                    <Td>{v.package}</Td>
                    <Td>{v.notes || "—"}</Td>
                    <Td dir="ltr">{v.affiliateCode || "—"}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-start text-xs font-bold uppercase tracking-wide">
      {children}
    </th>
  );
}

function Td({ children, ...rest }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td {...rest} className="px-4 py-3 align-top text-brand-black">
      {children}
    </td>
  );
}

function formatDate(d: Date | string) {
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
