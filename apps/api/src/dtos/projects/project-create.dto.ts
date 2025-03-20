import { ApiProperty } from '@nestjs/swagger';
import { ProjectCreateData } from '@repo/shared-types';

export default class ProjectCreateDto implements ProjectCreateData {
  @ApiProperty({
    description: 'Project image',
    type: 'string',
    format: 'binary',
  })
  media?: File;
  @ApiProperty({ description: 'Project name' })
  name: string;
  @ApiProperty({ description: 'Customer id of the project' })
  customerId: number;
}
