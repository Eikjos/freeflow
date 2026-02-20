'use client';

import { Card, CardContent, CardHeader } from '@components/ui/card';
import Loading from '@components/ui/loading';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { getEnterpriseNotificationsQueryOptions } from '../../../lib/api/enterprise';
import NotificationItemCard from './notification-item-card';

type NotificationCardProps = {
  className?: string;
  enterpriseId: number;
};

export default function NotificationCard({
  className,
  enterpriseId,
}: NotificationCardProps) {
  const t = useTranslations();

  const { data, isLoading } = useQuery(
    getEnterpriseNotificationsQueryOptions(enterpriseId),
  );

  return (
    <Card className={className}>
      <CardContent>
        <CardHeader className="px-0">{t('common.notifications')}</CardHeader>
        {isLoading && <Loading />}
        {data?.ok && data.data && data.data.length === 0 && (
          <div className="w-full h-[300px] flex justify-center items-center">
            <span className="text-gray-400 text-sm">Aucune notification</span>
          </div>
        )}
        {data?.ok && data.data && data.data.length > 0 && (
          <div className="w-full h-[300px] flex flex-col items-center p-2 bg-gray-300/10 rounded-md">
            {data.data?.map((d) => (
              <NotificationItemCard
                notification={d}
                key={d.id}
                className="w-full"
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
