import Header from "@/components/Header";
import Hero from "@/components/Hero";
import VideoSection from "@/components/VideoSection";
import Pricing from "@/components/Pricing";
import GiftVoucher from "@/components/GiftVoucher";
import WhyChooseUs from "@/components/WhyChooseUs";
import FlightExperience from "@/components/FlightExperience";
import Accessibility from "@/components/Accessibility";
import Safety from "@/components/Safety";
import Locations from "@/components/Locations";
import Testimonials from "@/components/Testimonials";
import ViralCopy from "@/components/ViralCopy";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import StickyWhatsApp from "@/components/StickyWhatsApp";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <VideoSection />
        <Pricing />
        <FlightExperience />
        <WhyChooseUs />
        <GiftVoucher />
        <Accessibility />
        <Safety />
        <Locations />
        <Testimonials />
        <ViralCopy />
        <ContactSection />
      </main>
      <Footer />
      <StickyWhatsApp />
    </>
  );
}
