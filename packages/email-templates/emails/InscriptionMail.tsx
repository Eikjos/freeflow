import { Button, Text } from "@react-email/components";
import Footer from "../components/Footer";
import Header from "../components/Header";
import TailwindConfig from "../components/TailwindConfig";

export type InscriptionMailProps = {
  clientUrl: string;
  apiUrl: string;
}

export default function InscriptionMail({ apiUrl, clientUrl } : InscriptionMailProps) {
  return (
    <TailwindConfig>
      <Header />
      <div className="mt-5 px-5">
        <Text className="font-amica text-center text-2xl mx-auto">
          Bienvenue sur Freeflow, la plateforme qui simplifie la gestion de votre entreprise !
        </Text>
        <Text>
          Votre compte a été créé avec succès et vous pouvez dès maintenant :
        </Text>
          <ul>
            <li>Suivre vos projets et tâches en temps réel</li>
            <li>Inviter vos clients</li>
            <li>
              Visualiser vos indicateurs clés en un coup d’œil
            </li>
            <li>
            Optimiser du temps sur la création de facture et sur la comptabilitê
            </li>
          </ul>
        <Text className="text-center mx-auto font-amica text-xl">
          Pour commencer, cliquez sur le bouton ci-dessous pour accéder à votre tableau de bord
        </Text>
        <div className="flex justify-center">
            <Button className="bg-primary px-6 py-2 rounded-full text-sm text-white w-44 text-center">Accèder à mon tableau de bord</Button>
        </div>
        <Text>
          Si vous n’avez pas créé ce compte, ignorez simplement ce message ou contactez notre support.
          Merci de nous rejoindre et bonne découverte de Freeflow !
        </Text>
         <Text>
          L’équipe Freeflow
        </Text>
      </div>
      <Footer />
    </TailwindConfig>
  );
}
