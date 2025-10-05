import { ExpenseFilterData } from '@repo/shared-types';

export default class ExpenseFilterDto implements ExpenseFilterData {
  search?: string;
  startDate?: Date;
  endDate?: Date;
  category?: number;
  amountMin?: number;
  amountMax?: number;
}
