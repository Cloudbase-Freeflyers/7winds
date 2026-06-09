import { redirect } from "next/navigation";
import AffiliateDashboard from "@/components/affiliate/AffiliateDashboard";
import { getSessionAffiliateId } from "@/lib/affiliate-auth";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "לוח שותפים",
  robots: { index: false, follow: false },
};

export default async function AffiliateDashboardPage() {
  const affiliateId = await getSessionAffiliateId();
  if (!affiliateId) {
    redirect("/affiliate/login");
  }

  return (
    <div className="min-h-screen bg-brand-soft text-brand-black" dir="rtl">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10">
        <AffiliateDashboard />
      </div>
    </div>
  );
}
