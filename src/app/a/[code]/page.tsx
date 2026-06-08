import { redirect } from "next/navigation";
import LandingPage from "@/components/LandingPage";
import { AffiliateProvider } from "@/context/AffiliateContext";
import { getAffiliateByCode } from "@/lib/affiliates";
import { BRAND } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return {
    robots: { index: false, follow: true },
    alternates: { canonical: BRAND.url },
  };
}

export default async function AffiliatePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const affiliate = await getAffiliateByCode(code);

  if (!affiliate || !affiliate._id) {
    redirect("/");
  }

  return (
    <AffiliateProvider
      affiliate={{
        id: String(affiliate._id),
        code: affiliate.code,
        name: affiliate.name,
      }}
    >
      <LandingPage />
    </AffiliateProvider>
  );
}
