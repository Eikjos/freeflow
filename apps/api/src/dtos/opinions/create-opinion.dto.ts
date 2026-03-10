import { ApiProperty } from '@nestjs/swagger';
import { CreateOpinionData } from '@repo/shared-types';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export default class CreateOpinionDto implements CreateOpinionData {
  @ApiProperty({ description: 'Opinion content' })
  @IsString()
  content: string;
  @ApiProperty({ description: 'Opinion rate' })
  @IsNumber()
  @Max(5)
  @Min(0)
  rate: number;
}
