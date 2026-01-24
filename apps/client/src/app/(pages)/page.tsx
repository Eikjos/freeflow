import DemoBanner from "@components/templates/demo-banner";
import FeatureSection from "@components/templates/feature-section";
import Footer from "@components/templates/footer";
import Header from "@components/templates/header";
import HeroBanner from "@components/templates/hero-banner";
import TarifsSection from "@components/templates/tarifs-section";
import { cookies } from "next/headers";
import { refresh } from "../../lib/api/auth";

export default async function LandingPage() {
  const authToken = (await cookies()).get('refreshToken');
  const user = (await refresh(authToken?.value ?? "")).data;

  return (
    <div>
      <Header
        displayMenu={true}
        isLogged={user !== undefined}
        isCustomer={user?.role === "customer"}
      />
      <HeroBanner />
      <DemoBanner />
      <FeatureSection />
      <TarifsSection />
      <Footer />
    </div>
  )
}