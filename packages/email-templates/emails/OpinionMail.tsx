import { Button, Text } from '@react-email/components';
import Footer from './components/Footer';
import Header from './components/Header';
import TailwindConfig from './components/TailwindConfig';

type OpinionMailProps = {
  clientUrl: string;
  enterpriseName: string;
  enterpriseId: number;
};

export function OpinionMail({
  clientUrl,
  enterpriseName,
  enterpriseId,
}: OpinionMailProps) {
  return (
    <TailwindConfig>
      <Header clientUrl={clientUrl} />
      <div className="mt-5 px-8">
        <Text className="mx-auto mt-10 mb-5">Bonjour,</Text>
        <Text>
          Cela fait 30 jours que vous commencé à bosser avec le prestataire{' '}
          {enterpriseName}. Vous pouvez donner votre avis sur ce prestataire
          maintenant (En cliquant sur le bouton ci-dessous)
        </Text>
        <div className="mt-10 text-center">
          <Button
            href={`${clientUrl}/opinions/create?enterpriseId=${enterpriseId}`}
            className="bg-primary px-6 py-2 rounded-full text-sm text-white w-44 text-center inline-block"
          >
            Donner son avis
          </Button>
        </div>
        <Text className="mt-10">
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
