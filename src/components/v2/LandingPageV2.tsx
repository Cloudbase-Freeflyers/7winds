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

export default function LandingPageV2() {
  return (
    <>
      <Header />
      <main>
        <HeroV2 />
        <StatsBar />
        <VideoSectionV2 />
        <Pricing />
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
        <ContactSection />
      </main>
      <Footer />
      <StickyWhatsApp />
    </>
  );
}
