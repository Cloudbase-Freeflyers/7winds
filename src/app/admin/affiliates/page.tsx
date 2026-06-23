import { headers } from "next/headers";
import AffiliateManager from "@/components/admin/AffiliateManager";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "ניהול שותפים",
  robots: { index: false, follow: false },
};

export default async function AdminAffiliatesPage() {
  await headers();

  return (
    <AdminShell
      active="affiliates"
      title="ניהול שותפים"
      subtitle="יצירת קישורים, QR codes, מעקב המרות ותשלומי עמלות."
    >
      <AffiliateManager />
    </AdminShell>
  );
}
