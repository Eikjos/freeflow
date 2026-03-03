import { ApiProperty } from '@nestjs/swagger';
import { CreateOpinionData } from '@repo/shared-types';

export default class CreateOpinionDto implements CreateOpinionData {
  @ApiProperty({ description: 'Opinion content' })
  content: string;
  @ApiProperty({ description: 'Opinion rate' })
  rate: number;
}
