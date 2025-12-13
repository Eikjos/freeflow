import DemoBanner from "@components/templates/demo-banner";
import FeatureSection from "@components/templates/feature-section";
import Footer from "@components/templates/footer";
import Header from "@components/templates/header";
import HeroBanner from "@components/templates/hero-banner";
import TarifsSection from "@components/templates/tarifs-section";

export default function LandingPage() {
  return (
    <div>
      <Header displayMenu={true} />
      <HeroBanner />
      <DemoBanner />
      <FeatureSection />
      <TarifsSection />
      <Footer />
    </div>
  )
}