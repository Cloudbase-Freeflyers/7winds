import { headers } from "next/headers";
import AffiliateManager from "@/components/admin/AffiliateManager";
import AdminNav from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "ניהול שותפים",
  robots: { index: false, follow: false },
};

export default async function AdminAffiliatesPage() {
  await headers();

  return (
    <div className="min-h-screen bg-brand-soft text-brand-black" dir="rtl">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-extrabold">ניהול שותפים</h1>
            <p className="text-brand-dark text-sm">
              יצירת קישורים, QR codes, מעקב המרות ותשלומי עמלות.
            </p>
          </div>
          <AdminNav active="affiliates" />
        </header>

        <div className="mt-8">
          <AffiliateManager />
        </div>
      </div>
    </div>
  );
}
