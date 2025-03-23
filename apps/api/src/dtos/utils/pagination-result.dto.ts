import { ParseIntPipe } from '@nestjs/common';
import { PaginationFilter, PaginationResult } from '@repo/shared-types';

export class PaginationResultDto<T> implements PaginationResult<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalItems: number;
}

export class PaginationFilterDto<T extends Record<string, string | number>>
  implements PaginationFilter<T>
{
  filter?: Partial<T>;
  asc?: keyof T;
  desc?: keyof T;
  page: number;
  pageSize: number;
}
