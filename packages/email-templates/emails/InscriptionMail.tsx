import { Button, Text } from "@react-email/components";
import Footer from "./components/Footer";
import Header from "./components/Header";
import TailwindConfig from "./components/TailwindConfig";

export type InscriptionMailProps = {
  clientUrl: string;
}

export function InscriptionMail({ clientUrl } : InscriptionMailProps) {
  return (
    <TailwindConfig>
      <Header clientUrl={clientUrl} />
      <div className="mt-5 px-8">
        <Text className="text-center text-2xl mx-auto mt-10 mb-5">
          Bienvenue sur Freeflow, la plateforme qui simplifie la gestion de votre entreprise !
        </Text>
        <Text>
          Votre compte a été créé avec succès et vous pouvez dès maintenant :
        </Text>
          <ul className="text-sm font-display">
            <li>Suivre vos projets et tâches en temps réel</li>
            <li>Inviter vos clients</li>
            <li>
              Visualiser vos indicateurs clés en un coup d’œil
            </li>
            <li>
            Optimiser du temps sur la création de facture et sur la comptabilitê
            </li>
          </ul>
        <Text className="text-center mx-auto text-xl mt-10">
          Pour commencer, cliquez sur le bouton ci-dessous pour accéder à votre tableau de bord
        </Text>
        <div className="mt-10 text-center">
          <Button className="bg-primary px-6 py-2 rounded-full text-sm text-white w-44 inline-block" href={`${clientUrl}`}>
            Accéder à mon tableau de bord
          </Button>
        </div>
        <Text className="mt-10 text-nowrap">
          Si vous n’avez pas créé ce compte, ignorez simplement ce message ou contactez notre support.
          Merci de nous rejoindre et bonne découverte de Freeflow !
        </Text>
        <Text>
          Cordialement,
          <br />
          L’équipe Freeflow
        </Text>
      </div>
      <Footer />
    </TailwindConfig>
  );
}
