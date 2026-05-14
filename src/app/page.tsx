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

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* 1. Hero */}
        <Hero />
        {/* 2. Social proof numbers */}
        <StatsBar />
        {/* 3. Video */}
        <VideoSection />
        {/* 4. Pricing — sales-y */}
        <Pricing />
        {/* 5. How it works */}
        <FlightExperience />
        {/* 6. Why us */}
        <WhyChooseUs />
        {/* 7. Gift voucher */}
        <GiftVoucher />
        {/* 8. Shorts gallery */}
        <ShortsCarousel />
        {/* 9. Accessibility */}
        <Accessibility />
        {/* 10. Safety */}
        <Safety />
        {/* 11. Locations */}
        <Locations />
        {/* 12. Reviews */}
        <TripAdvisorReviews />
        {/* 13. FAQ */}
        <FAQ />
        {/* 14. Marquee */}
        <ViralCopy />
        {/* 15. Contact */}
        <ContactSection />
      </main>
      <Footer />
      <StickyWhatsApp />
    </>
  );
}
