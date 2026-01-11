import { Button, Text } from "@react-email/components";
import Footer from "../components/Footer";
import Header from "../components/Header";
import TailwindConfig from "../components/TailwindConfig";

type CustomerInviteMailProps = {
  clientUrl: string;
  token: string;
  enterpriseName: string;
}

export function CustomerInviteMail({ clientUrl, enterpriseName, token } : CustomerInviteMailProps) {
  return (
    <TailwindConfig>
      <Header clientUrl={clientUrl} />
      <div className="mt-5 px-8">
        <Text className="mx-auto mt-10 mb-5">
            Bonjour,
        </Text>
        <Text>
          {enterpriseName} vous a ajouté en tant que client sur la plateforme Freeflow, notre solution de gestion et de collaboration professionnelle.
          Afin d’accéder à votre espace client, consulter vos documents, suivre vos demandes et faciliter vos échanges avec l’entreprise, nous vous invitons à activer votre compte en cliquant sur le lien ci-dessous :
        </Text>
        <div className="mt-10 text-center">
          <Button href={`${clientUrl}/inscription/customer?token=${encodeURIComponent(token)}`} className="bg-primary px-6 py-2 rounded-full text-sm text-white w-44 text-center inline-block">
            Activer mon compte
          </Button>
        </div>
        <Text className="mt-10">
          Lors de votre première connexion, il vous sera demandé de définir votre mot de passe et de vérifier vos informations.
          Si vous n’êtes pas à l’origine de cette demande ou si vous pensez qu’il s’agit d’une erreur, veuillez ignorer ce message ou contacter directement votre entreprise.
          Nous restons à votre disposition pour toute question.
          <br />
          <br />
          Cordialement,
          <br />
          L’équipe Freeflow
        </Text>
      </div>
      <Footer />
    </TailwindConfig>
  );
}
