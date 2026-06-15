import Header from "@/components/Header";
import StatsBar from "@/components/StatsBar";
import Pricing from "@/components/Pricing";
import WhyChooseUs from "@/components/WhyChooseUs";
import GiftVoucher from "@/components/GiftVoucher";
import ShortsCarousel from "@/components/ShortsCarousel";
import Accessibility from "@/components/Accessibility";
import Safety from "@/components/Safety";
import Locations from "@/components/Locations";
import TripAdvisorReviews from "@/components/TripAdvisorReviews";
import FAQ from "@/components/FAQ";
import ViralCopy from "@/components/ViralCopy";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import StickyWhatsApp from "@/components/StickyWhatsApp";
import HeroV2 from "@/components/v2/HeroV2";
import VideoSectionV2 from "@/components/v2/VideoSectionV2";
import FlightExperienceV2 from "@/components/v2/FlightExperienceV2";

type Props = {
  /** Enables dev-only test checkout (₪5) — use on /dev only */
  dev?: boolean;
};

export default function LandingPageV2({ dev = false }: Props) {
  return (
    <>
      <Header />
      {dev && (
        <div
          className="bg-amber-400 text-amber-950 text-center text-sm font-bold px-4 py-2"
          role="status"
        >
          🧪 דף בדיקות — כולל מסלול תשלום בדיקה ב-₪5 · לא לשיתוף עם לקוחות
        </div>
      )}
      <main>
        <HeroV2 />
        <StatsBar />
        <VideoSectionV2 />
        <Pricing includeTestPackage={dev} />
        <FlightExperienceV2 />
        <WhyChooseUs />
        <GiftVoucher />
        <ShortsCarousel />
        <Accessibility />
        <Safety />
        <Locations />
        <TripAdvisorReviews />
        <FAQ />
        <ViralCopy />
        <ContactSection includeTestPackage={dev} />
      </main>
      <Footer />
      <StickyWhatsApp />
    </>
  );
}
