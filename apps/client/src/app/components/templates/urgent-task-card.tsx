'use client';

import { Card, CardContent, CardHeader } from '@components/ui/card';
import Loading from '@components/ui/loading';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { getUrgentTasksQueryOptions } from '../../../lib/api/tasks';
import TaskItemCard from './task-item-card';

type UrgentTaskCardProps = {
  className?: string;
};

export default function UrgentTaskCard({ className }: UrgentTaskCardProps) {
  const { data, isLoading } = useQuery(getUrgentTasksQueryOptions());
  const t = useTranslations();
  return (
    <Card className={className}>
      <CardContent>
        <CardHeader className="px-0">{t('task.urgents.title')}</CardHeader>
        {isLoading && (
          <div className="w-full h-[300px] flex justify-center items-center">
            <Loading />
          </div>
        )}
        {!isLoading && data && data.data && data.data.length > 0 ? (
          <div className="flex flex-col w-full items-center h-[300px] overflow-y-scroll bg-gray-300/10 p-2 rounded-md">
            {data.data.map((task, index) => (
              <TaskItemCard
                task={task}
                key={index}
                className="w-full"
              ></TaskItemCard>
            ))}
          </div>
        ) : (
          <div className="w-full h-[300px] flex justify-center items-center">
            <span className="text-gray-400 text-sm">
              {t('task.urgents.any')}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
