import { ApiProperty } from '@nestjs/swagger';
import { CreateColumnData } from '@repo/shared-types';
import { IsString } from 'class-validator';

export default class CreateColumnDto implements CreateColumnData {
  @ApiProperty({ description: 'Name of column' })
  @IsString()
  name: string;
}
