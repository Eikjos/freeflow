'use client';

import CreateObjectiveDialog from '@components/templates/create-objective-dialog';
import ObjectiveTable from '@components/templates/objective-table';
import { Button } from '@components/ui/button';
import { Pagination } from '@components/ui/pagination';
import { PaginationFilter } from '@repo/shared-types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { getAllObjectiveQueryOptions } from '../../../lib/api/objectives';

export default function ObjectiveList() {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<PaginationFilter<never>>({
    page: 0,
    pageSize: 15,
  });
  const { data, isLoading, refetch } = useQuery(
    getAllObjectiveQueryOptions(filter),
  );
  const handleChangePage = (page: number) => {
    setFilter((prev) => ({ ...prev, page }));
  };

  const handleReload = () => {
    void queryClient.invalidateQueries({
      queryKey: ['objectives'],
    });
    if (
      data &&
      data.data &&
      data.data.totalItems % filter.pageSize === 1 &&
      filter.page > 0
    ) {
      setFilter((prev) => ({ ...prev, page: prev.page - 1 }));
    }
    void refetch();
  };

  return (
    <>
      <div className="mb-5 flex flex-row justify-end">
        <CreateObjectiveDialog
          trigger={
            <Button>
              {t('common.add')} <Plus />
            </Button>
          }
          isUpdate={false}
          callback={handleReload}
        />
      </div>

      <ObjectiveTable
        data={data?.data?.data ?? []}
        isLoading={isLoading}
        onDelete={handleReload}
        onUpdate={handleReload}
      />
      <Pagination
        page={filter.page}
        pageSize={filter.pageSize}
        totalItems={data?.data?.totalItems ?? 0}
        onChangePage={handleChangePage}
        className="mt-5"
      />
    </>
  );
}
