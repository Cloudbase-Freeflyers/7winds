import LandingPage from "@/components/LandingPage";
import { AffiliateProvider } from "@/context/AffiliateContext";

export default function Home() {
  return (
    <AffiliateProvider affiliate={null}>
      <LandingPage />
    </AffiliateProvider>
  );
}
