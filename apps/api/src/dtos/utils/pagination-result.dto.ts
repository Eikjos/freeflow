import { ApiProperty } from '@nestjs/swagger'
import { PaginationFilter, PaginationResult } from '@repo/shared-types'
import { IsInt, IsOptional, IsString } from 'class-validator'

export class PaginationResultDto<T> implements PaginationResult<T> {
  data: T[]
  page: number
  pageSize: number
  totalItems: number
}

export class PaginationFilterDto<T extends Record<string, any>>
  implements PaginationFilter<T>
{
  @ApiProperty({
    description: 'Filter criteria as an object with key-value pairs',
    type: Object,
    required: false,
  })
  @IsOptional()
  filter?: Partial<T>
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Field name to sort the results in ascending order',
    required: false,
    type: String,
  })
  asc?: keyof T
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Field name to sort the results in descending order',
    required: false,
    type: String,
  })
  desc?: keyof T
  @IsInt()
  @ApiProperty({ description: 'Page number for pagination' })
  page: number
  @IsInt()
  @ApiProperty({ description: 'Page size for pagination' })
  pageSize: number
}
