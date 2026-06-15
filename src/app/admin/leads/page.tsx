import { headers } from "next/headers";
import AdminNav from "@/components/admin/AdminNav";
import LeadsManager from "@/components/admin/LeadsManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "ניהול פניות",
  robots: { index: false, follow: false },
};

export default async function AdminLeadsPage() {
  await headers();

  return (
    <div className="min-h-screen bg-brand-soft text-brand-black" dir="rtl">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-extrabold">לידים ושוברים</h1>
            <p className="text-brand-dark text-sm">
              100 הרשומות האחרונות · עריכה, מחיקה ועדכון סטטוס.
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

        <div className="mt-8">
          <LeadsManager />
        </div>
      </div>
    </div>
  );
}
