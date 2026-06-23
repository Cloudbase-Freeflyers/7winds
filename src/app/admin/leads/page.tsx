import { headers } from "next/headers";
import AdminShell from "@/components/admin/AdminShell";
import LeadsManager from "@/components/admin/LeadsManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "ניהול פניות",
  robots: { index: false, follow: false },
};

export default async function AdminLeadsPage() {
  await headers();

  return (
    <AdminShell
      active="leads"
      title="לידים ושוברים"
      subtitle="100 הרשומות האחרונות · עריכה, מחיקה ועדכון סטטוס."
      actions={
        <>
          <a className="btn-secondary btn-sm" href="/api/admin/list?type=leads&format=csv">
            ייצוא לידים CSV
          </a>
          <a
            className="btn-secondary btn-sm"
            href="/api/admin/list?type=vouchers&format=csv"
          >
            ייצוא שוברים CSV
          </a>
        </>
      }
    >
      <LeadsManager />
    </AdminShell>
  );
}
