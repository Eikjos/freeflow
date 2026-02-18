import CustomerInscriptionForm from '@components/templates/customer-inscription-form';
import Footer from '@components/templates/footer';
import Header from '@components/templates/header';

type InscriptionCustomerPageProps = {
  searchParams: {
    token: string;
  };
};

export default function InscriptionCustomerPage({
  searchParams,
}: InscriptionCustomerPageProps) {
  return (
    <div>
      <Header displayMenu={false} />
      <div className="min-h-[70vh]">
        <CustomerInscriptionForm
          className="w-1/2 mx-auto mt-20 mb-10"
          token={searchParams.token}
        />
      </div>
      <Footer />
    </div>
  );
}
