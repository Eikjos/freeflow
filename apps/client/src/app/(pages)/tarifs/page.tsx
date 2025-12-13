import Footer from "@components/templates/footer";
import Header from "@components/templates/header";
import TarifsSection from "@components/templates/tarifs-section";
import Link from "next/link";

export default function TarifsPage() {
  return (
    <div>
      <Header displayMenu={false} />
      <TarifsSection />
      <div className="w-1/2 text-center mx-auto">
        <p>Déjà inscrit ? {" "}
          <Link as="span" href="/login">
            <span className="text-primary">
              Connectez-vous
            </span>
          </Link>
        </p>
      </div>
      <Footer />
    </div>
  )
}