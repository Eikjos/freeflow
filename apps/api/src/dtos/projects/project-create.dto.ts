import { ApiProperty } from '@nestjs/swagger'
import { ProjectCreateData } from '@repo/shared-types'
import { IsInt, IsString } from 'class-validator'

export default class ProjectCreateDto implements ProjectCreateData {
  @ApiProperty({
    description: 'Project image',
    type: 'string',
    format: 'binary',
  })
  media?: File
  @ApiProperty({ description: 'Project name' })
  @IsString()
  name: string
  @ApiProperty({ description: 'Customer id of the project' })
  @IsInt()
  customerId: number
}
