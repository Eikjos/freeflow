import { Button, Text } from "@react-email/components";
import Footer from "./components/Footer";
import Header from "./components/Header";
import TailwindConfig from "./components/TailwindConfig";

type InvoiceMailProps = {
  clientUrl: string;
}

export function InvoiceMail({ clientUrl } : InvoiceMailProps) {
  return (
    <TailwindConfig>
      <Header clientUrl={clientUrl} />
        <Text className="text-3xl text-center mt-5 mb-5">
          Vous avez reçu une nouvelle facture
      </Text>
      <div className="px-8">
        <Text>
          Bonjour,
          <br />
          Veuillez trouver ci-joint votre facture n°[Numéro de facture], émise le [Date d’émission] et relative à [Description du service / période / produit]. Le montant de celle-ci s'élève à 1000,00 €.
          <br />
        </Text>
        <Text className="text-2xl text-center mt-5 mb-5">
          Vous pouvez télécharger la facture en utilisant le lien ci-dessous :
        </Text>
        <div className="mt-10 text-center">
            <Button className="bg-primary px-6 py-2 rounded-full text-sm text-white w-44 text-center inline-block">Télécharger la facture</Button>
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