import { ApiProperty } from '@nestjs/swagger';
import { ExpenseCategoryData } from '@repo/shared-types';

export default class ExpenseCategoryDto implements ExpenseCategoryData {
  @ApiProperty({ description: 'The id of expense category' })
  id: number;
  @ApiProperty({ description: 'The key for translation the category' })
  key: string;
  @ApiProperty({ description: 'The expense category name' })
  name: string;
  @ApiProperty({ description: 'The expense category tva' })
  tva: number;
  @ApiProperty({ description: 'The expense category recoverable percent' })
  recoverablePercent: number;
}
