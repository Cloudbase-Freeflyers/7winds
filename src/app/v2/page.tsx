import LandingPageV2 from "@/components/v2/LandingPageV2";
import { AffiliateProvider } from "@/context/AffiliateContext";

export const metadata = {
  title: "7Winds — טיסת מצנח רחיפה | v2",
};

export default function V2Page() {
  return (
    <AffiliateProvider affiliate={null}>
      <LandingPageV2 />
    </AffiliateProvider>
  );
}
