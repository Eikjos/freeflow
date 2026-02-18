'use client';

import ExpenseFilter from '@components/organisms/expense-filter';
import ExpenseTable from '@components/templates/expense-table';
import { Button } from '@components/ui/button';
import { Pagination } from '@components/ui/pagination';
import { ExpenseFilterData, PaginationFilter } from '@repo/shared-types';
import { useQuery } from '@tanstack/react-query';
import { deleteExpense } from 'actions/expense';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';
import { getAllExpenseQueryOptions } from '../../../../lib/api/expense';
import getQueryClient from '../../../../lib/query-client';

function ExpensesPage() {
  const t = useTranslations();
  const queryClient = getQueryClient();
  const [filter, setFilter] = useState<ExpenseFilterData>();
  const paginationFilter: PaginationFilter<ExpenseFilterData> = {
    page: 0,
    pageSize: 10,
    filter: filter,
  };
  const { data, isLoading, refetch } = useQuery(
    getAllExpenseQueryOptions(paginationFilter),
  );

  const handleDeleteExpense = (id: number) => {
    deleteExpense(id)
      .then(async () => {
        await refetch();
        await queryClient.invalidateQueries({
          queryKey: ['expenses'],
          exact: false,
        });
        toast.success(t('expense.success.delete'));
      })
      .catch((e: Error) => {
        toast.error(t(e.message));
      });
  };

  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <h1 className="font-amica text-4xl">{t('expense.titlePage')}</h1>
        <Button asChild>
          <Link href={'/expenses/create'}>
            <Plus />
            {t('expense.add')}
          </Link>
        </Button>
      </div>
      <ExpenseFilter onChangeFilter={(filter) => setFilter(filter)} />
      <ExpenseTable
        data={data?.data?.data ?? []}
        isLoading={isLoading}
        className="mt-5"
        handleDelete={handleDeleteExpense}
      />
      <Pagination
        className="mt-10"
        page={paginationFilter.page}
        pageSize={paginationFilter.pageSize}
        onChangePage={(value) => (paginationFilter.page = value)}
        totalItems={data?.data?.totalItems ?? 0}
      />
    </>
  );
}

export default ExpensesPage;
