import ApiPublicInformation from '@components/organisms/api-public-information';
import EnterpriseSettings from '@components/organisms/enterprise-settings';
import ObjectiveList from '@components/organisms/objective-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { headers } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import { EnterpriseInfo } from '../../../../types/enterprise-info-type';
import NotFoundEnterprise from '../not-found';

export default async function MyEnterprisePage() {
  const enterpriseHeader = (await headers()).get('x-enterprise');
  if (!enterpriseHeader) return <NotFoundEnterprise />;
  const enterprise = JSON.parse(enterpriseHeader) as EnterpriseInfo;
  if (!enterprise) return <NotFoundEnterprise />;
  const t = await getTranslations();
  return (
    <>
      <h1 className="font-amica text-4xl">{t('enterprise.my')}</h1>
      <Tabs defaultValue="enterprise" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="enterprise" className="w-1/3">
            {t('tabs.enterprise')}
          </TabsTrigger>
          <TabsTrigger value="objective" className="w-1/3">
            {t('tabs.objective')}
          </TabsTrigger>
          <TabsTrigger value="apiPublic" className="w-1/3">
            API Publique
          </TabsTrigger>
        </TabsList>
        <TabsContent value="enterprise">
          <EnterpriseSettings />
        </TabsContent>
        <TabsContent value="objective">
          <ObjectiveList />
        </TabsContent>
        <TabsContent value="apiPublic">
          <ApiPublicInformation enterpriseId={enterprise.id} />
        </TabsContent>
      </Tabs>
    </>
  );
}
