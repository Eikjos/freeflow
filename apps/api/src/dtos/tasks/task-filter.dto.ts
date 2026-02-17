import { TaskFilter } from '@repo/shared-types'
import { Type } from 'class-transformer'
import { IsNumber, IsOptional } from 'class-validator'
import { PaginationFilterDto } from '../utils/pagination-result.dto'

export default class TaskFilterDto implements TaskFilter {
  name?: string
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  customerId?: number;
  [key: string]: string | number
}

export class TaskPaginationFilterDto extends PaginationFilterDto<TaskFilterDto> {
  @Type(() => TaskFilterDto)
  filter?: Partial<TaskFilterDto>
}
