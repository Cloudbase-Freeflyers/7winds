import LandingPageV2 from "@/components/v2/LandingPageV2";
import { AffiliateProvider } from "@/context/AffiliateContext";

export const metadata = {
  title: "7Winds — Dev / בדיקות",
  robots: { index: false, follow: false },
};

export default function DevPage() {
  return (
    <AffiliateProvider affiliate={null}>
      <LandingPageV2 dev />
    </AffiliateProvider>
  );
}
