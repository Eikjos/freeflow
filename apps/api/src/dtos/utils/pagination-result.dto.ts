import { PaginationResult } from '@repo/shared-types';

export default class PaginationResultDto<T> implements PaginationResult<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalItems: number;
}
