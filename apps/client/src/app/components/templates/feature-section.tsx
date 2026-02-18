import {
  ClipboardCheck,
  FileSpreadsheet,
  ReceiptEuro,
  UsersRound,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import FeatureCard from './feature-card';

export default async function FeatureSection() {
  const t = await getTranslations();
  return (
    <div className="mt-10 border-t bg-card px-10 py-5" id="features">
      <h1 className="text-center text-2xl text-secondary">
        {t('landing.features.title')}
      </h1>
      <p className="text-center text-3xl font-semibold w-1/2 mx-auto">
        {t('landing.features.description1')}
        <br />
        <span className="text-xl font-extralight">
          {t('landing.features.description2')}
        </span>
      </p>
      <div className="my-10 grid grid-cols-2 gap-4 w-3/4 mx-auto">
        <FeatureCard
          title={t('landing.features.cards.invoice.title')}
          description={t('landing.features.cards.invoice.content')}
          icon={<FileSpreadsheet color="white" />}
          color="#3e6450"
        />
        <FeatureCard
          title={t('landing.features.cards.expense.title')}
          description={t('landing.features.cards.expense.content')}
          icon={<ReceiptEuro color="white" />}
          color="rgb(59, 130, 246)"
        />
        <FeatureCard
          title={t('landing.features.cards.customer.title')}
          description={t('landing.features.cards.customer.content')}
          icon={<UsersRound color="white" />}
          color="rgb(139, 92, 246)"
        />
        <FeatureCard
          title={t('landing.features.cards.task.title')}
          description={t('landing.features.cards.task.content')}
          icon={<ClipboardCheck color="white" />}
          color="#fea052"
        />
      </div>
    </div>
  );
}
