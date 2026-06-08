import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import VideoSection from "@/components/VideoSection";
import Pricing from "@/components/Pricing";
import FlightExperience from "@/components/FlightExperience";
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

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <StatsBar />
        <VideoSection />
        <Pricing />
        <FlightExperience />
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
