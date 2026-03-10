import NotFoundEnterprise from '(pages)/(enterprise)/not-found';
import CreateOpinionForm from '@components/templates/create-opinion-form';
import Footer from '@components/templates/footer';
import Header from '@components/templates/header';
import { headers } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import { getEnterprise } from '../../../../lib/api/enterprise';
import { CustomerInfo } from '../../../../types/customer-info-type';

type CreateOptinionPageProps = {
  searchParams: {
    enterpriseId?: string;
  };
};

export default async function CreateOpinionPage({
  searchParams,
}: CreateOptinionPageProps) {
  const headersCustomer = (await headers()).get('x-customer');
  if (!headersCustomer) return <NotFoundEnterprise />;
  const customer = JSON.parse(headersCustomer) as CustomerInfo;
  if (!customer) return <NotFoundEnterprise />;

  const enterpriseParams = (await searchParams).enterpriseId;
  if (!enterpriseParams) return <NotFoundEnterprise />;
  const enterpriseId = parseInt(enterpriseParams);
  const enterprise = await getEnterprise(enterpriseId);
  if (!enterprise.ok || (enterprise.ok && enterprise.data === undefined))
    return <NotFoundEnterprise />;

  const t = await getTranslations();

  if (enterprise.ok && enterprise.data !== undefined) {
    return (
      <>
        <Header displayMenu={false} isCustomer isLogged />
        <div className="min-h-[75vh] mx-24">
          <h1 className="mt-10 text-4xl font-amica text-center">
            {t('opinion.give', { enterprise: enterprise.data.name })}
          </h1>
          <CreateOpinionForm entepriseId={enterprise.data.id} />
        </div>
        <Footer />
      </>
    );
  }
}
