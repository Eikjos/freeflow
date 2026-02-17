import { ApiProperty } from '@nestjs/swagger'
import { Customer, Enterprise, Project } from '@prisma/client'
import { ProjectData } from '@repo/shared-types'

export class ProjectDto implements ProjectData {
  @ApiProperty({ description: 'Project Id' })
  id: number
  @ApiProperty({ description: 'Project name' })
  name: string
  @ApiProperty({ description: 'Project customer name' })
  customer: string
  @ApiProperty({ description: 'Service provider name' })
  enterprise: string
  @ApiProperty({ description: 'Project media' })
  media?: number
}

export class ProjectDetailDto implements ProjectDetailDto {
  @ApiProperty({ description: 'Project Id' })
  id: number
  @ApiProperty({ description: 'Project name' })
  name: string
  @ApiProperty({ description: 'Project customer id' })
  customerId: number
  @ApiProperty({ description: 'Project media id' })
  mediaId?: number
}

export const mapProjectToDto = (
  project: Project,
  customer: Customer,
  enterprise: Enterprise,
) => {
  return {
    id: project.id,
    name: project.name,
    customer: customer.name,
    enterprise: enterprise.name,
    media: project.mediaId,
  } as ProjectDto
}

export const mapProjectToDetailDto = (project: Project) => {
  return {
    id: project.id,
    name: project.name,
    customerId: project.customerId,
    mediaId: project.mediaId,
  }
}
