import {
  ExpenseData,
  ExpenseFilterData,
  PaginationFilter,
  PaginationResult,
} from '@repo/shared-types';
import { client } from '../client';
import { generateQueryString } from '../utils';

export const getAllExpense = async (
  filter: PaginationFilter<ExpenseFilterData>,
) => {
  const query = generateQueryString(filter);
  return await client<PaginationResult<ExpenseData>>(`expenses?${query}`);
};

export const getAllExpenseQueryOptions = (
  filter: PaginationFilter<ExpenseFilterData>,
) => ({
  queryFn: () => getAllExpense(filter),
  queryKey: ['expenses', filter],
  retry: false,
});
