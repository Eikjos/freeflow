import { ApiProperty } from '@nestjs/swagger';
import { Customer, Project } from '@prisma/client';
import { ProjectData } from '@repo/shared-types';

export class ProjectDto implements ProjectData {
  @ApiProperty({ description: 'Project Id' })
  id: number;
  @ApiProperty({ description: 'Project name' })
  name: string;
  @ApiProperty({ description: 'Project customer name' })
  customer: string;
  @ApiProperty({ description: 'Project media' })
  media?: number;
}

export const mapProjectToDto = (project: Project, customer: Customer) => {
  return {
    id: project.id,
    name: project.name,
    customer: customer.name,
    media: project.mediaId,
  } as ProjectDto;
};
