'use client';

import NotFoundEnterprise from '(pages)/(enterprise)/not-found';
import StarRating from '@components/molecules/start-rating';
import { Card, CardContent, CardHeader } from '@components/ui/card';
import Loading from '@components/ui/loading';
import { Separator } from '@components/ui/separator';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEnterprise } from 'providers/enterprise-provider';
import {
  getOpinionRateQueryOptions,
  getOpinionsQueryOptions,
} from '../../../lib/api/opinion';
import OpinionItemCard from './opinion-item-card';

type OpinionCardProps = {
  className?: string;
};

export default function OpinionCard({ className }: OpinionCardProps) {
  const { enterprise } = useEnterprise();
  if (enterprise === undefined) return <NotFoundEnterprise />;

  const t = useTranslations();
  const { data: rateData, isLoading: isLoadingRate } = useQuery({
    ...getOpinionRateQueryOptions(enterprise.id),
    enabled: enterprise !== undefined,
  });
  const { data: opinionData, isLoading: isLoadingOpinion } = useQuery({
    ...getOpinionsQueryOptions(enterprise.id),
    enabled: enterprise !== undefined,
  });

  if (isLoadingOpinion && isLoadingRate) {
    return (
      <Card className={className}>
        <CardContent>
          <CardHeader className="px-0">{t('opinion.last.title')}</CardHeader>
          <div className="lg:h-[300px] flex justify-items-center items-center">
            <Loading />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent>
        <CardHeader className="px-0">{t('opinion.last.title')}</CardHeader>

        <div
          className="
              flex 
              md:flex-row
              flex-col
              h-auto 
              lg:h-[300px]
              gap-5
              items-center
            "
        >
          {/* Note globale */}
          <div className="flex justify-center lg:justify-start w-1/3">
            <StarRating
              readOnly
              value={rateData?.data ?? 0}
              className="w-full"
              withValueDisplay
            />
          </div>

          {/* Séparateur (visible seulement sur desktop) */}
          <Separator
            orientation="vertical"
            className="h-5/6 rounded-md bg-secondary sm:hidden lg:block justify-center"
          />

          {/* Avis récents */}
          <div className="bg-gray-300/10 rounded-md p-2 h-[250px] lg:h-[300px] w-full flex flex-col gap-2">
            {opinionData?.ok &&
              opinionData.data &&
              opinionData.data.length === 0 && (
                <div className="h-full flex items-center justify-center">
                  <p className="text-center text-sm text-muted-foreground">
                    {t('opinion.empty')}
                  </p>
                </div>
              )}
            {opinionData?.ok &&
              opinionData.data &&
              opinionData.data.length > 0 && (
                <>
                  {opinionData.data.map((o) => (
                    <OpinionItemCard key={o.id} opinion={o} />
                  ))}
                </>
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
