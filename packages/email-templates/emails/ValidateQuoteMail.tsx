import { Text } from '@react-email/components';
import Footer from './components/Footer';
import Header from './components/Header';
import TailwindConfig from './components/TailwindConfig';

type InvoiceMailProps = {
  clientUrl: string;
  code: string;
  devis: string;
};

export function ValidateQuoteMail({
  clientUrl,
  code,
  devis,
}: InvoiceMailProps) {
  return (
    <TailwindConfig>
      <Header clientUrl={clientUrl} />
      <Text className="text-3xl text-center mt-5 mb-5">Code de validation</Text>
      <div className="px-8">
        <Text>
          Bonjour,
          <br />
          Voici votre code de validation Freeflow :
          <br />
        </Text>
      </div>
      <Text className="font-bold text-center text-2xl">{code}</Text>
      <div className="px-8">
        <Text>
          Ce code est valable pendant cinq minutes.
          <br />
          Si vous n'êtes pas à l'origine de cette demande. Veuillez contacter le
          support.
          <br />
          Cordialement,
        </Text>
      </div>
      <Footer />
    </TailwindConfig>
  );
}
