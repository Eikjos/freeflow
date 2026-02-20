import { KPICard } from '@components/molecules/kpi-card';
import NotificationCard from '@components/templates/notifications-card';
import ObjectiveCard from '@components/templates/objective-card';
import OpinionCard from '@components/templates/opinion-card';
import PrevisionsCard from '@components/templates/previsions-card';
import UrgentTaskCard from '@components/templates/urgent-task-card';
import { getTranslations } from 'next-intl/server';
import { headers } from 'next/headers';
import { client } from '../../../../lib/client';
import { EnterpriseInfo } from '../../../../types/enterprise-info-type';
import NotFoundEnterprise from '../not-found';

export default async function Home() {
  const headersEnterprise = (await headers()).get('x-enterprise');
  const enterprise: EnterpriseInfo | null = headersEnterprise
    ? (JSON.parse(headersEnterprise) as EnterpriseInfo)
    : null;

  if (!enterprise) {
    return <NotFoundEnterprise />;
  }

  const customer = await client<number>('customers/count');
  const project = await client<number>('projects/count');
  const sale = await client<number>('sales/total');
  const t = await getTranslations();

  return (
    <div className="px-4 py-2">
      <h1 className="font-amica text-4xl mb-4">{t('common.dashboard')}</h1>

      {/* GRID KPI + OBJECTIFS + PREVISIONS */}
      <div
        className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-4 
          gap-5
        "
      >
        {/* Colonne KPI (prend 1 colonne sur mobile, 1 sur desktop) */}
        <div className="flex flex-col gap-3 order-1">
          <KPICard
            value={sale.data ?? 0}
            title={t('common.sales')}
            type="sale"
          />
          <KPICard
            value={customer.data ?? 0}
            title={t('common.customers')}
            type="default"
          />
          <KPICard
            value={project.data ?? 0}
            title={t('common.projects')}
            type="default"
          />
        </div>

        {/* Objectifs (1 col mobile, 1 col desktop) */}
        <ObjectiveCard className="min-h-[260px] lg:h-[400px] order-2" />

        {/* Prévisions (sur desktop, prend 2 colonnes) */}
        <PrevisionsCard
          className="
            min-h-[260px] 
            lg:h-[400px] 
            order-3 
            sm:col-auto 
            md:col-span-2
          "
        />
      </div>

      {/* GRID Notifications + Urgent Tasks */}
      <div
        className="
          grid 
          grid-cols-1 
          lg:grid-cols-2 
          gap-5 
          mt-5
        "
      >
        <NotificationCard className="w-full" enterpriseId={enterprise.id} />
        <UrgentTaskCard className="w-full" />
      </div>

      {/* DERNIERS AVIS */}
      <OpinionCard className="w-full mt-5" />
    </div>
  );
}
