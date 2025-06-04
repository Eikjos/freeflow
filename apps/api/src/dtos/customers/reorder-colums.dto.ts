import { ReOrderColumsData } from '@repo/shared-types';
import { Type } from 'class-transformer';
import { IsArray } from 'class-validator';

export default class ReorderColumnsDto implements ReOrderColumsData {
  @IsArray()
  @Type(() => Number)
  orderedColumnIds: number[];
}
