import { Button, Text } from "@react-email/components";
import Footer from "../components/Footer";
import Header from "../components/Header";
import TailwindConfig from "../components/TailwindConfig";

export type InvoiceMailProps = {
  clientUrl: string;
  apiUrl: string;
}

export default function InvoiceMail() {
  return (
    <TailwindConfig>
      <Header />
        <Text className="text-3xl font-amica text-center mt-5 mb-5">
          Vous avez reçu une nouvelle facture
      </Text>
      <div className="px-8">
        <Text>
          Bonjour,
          <br />
          Veuillez trouver ci-joint votre facture n°[Numéro de facture], émise le [Date d’émission] et relative à [Description du service / période / produit]. Le montant de celle-ci s'élève à 1000,00 €.
          <br />
        </Text>
        <Text className="text-2xl font-amica text-center mt-5 mb-5">
          Vous pouvez télécharger la facture en utilisant le lien ci-dessous :
        </Text>
        <div className="flex justify-center mt-10">
            <Button className="bg-primary px-6 py-2 rounded-full text-sm text-white w-44 text-center">Télécharger la facture</Button>
        </div>
        <Text>
          Nous vous remercions de bien vouloir procéder au règlement dans les délais impartis.
          Pour toute question ou demande d’information complémentaire, notre service administratif reste à votre disposition à l’adresse suivante : [Email du support].
          Nous vous remercions pour votre confiance.
          <br />
          <br />
          Cordialement,
          <br />
          Proxiad Axe Seine
        </Text>
      </div>
     
      <Footer />
    </TailwindConfig>
  )
}