import { Project } from '@prisma/client'
import { Transform } from 'class-transformer'
import { IsInt, IsString } from 'class-validator'

export default class ProjectFilterDto implements Project {
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  id: number
  @IsString()
  name: string
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  customerId: number
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  enterpriseId: number
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  mediaId: number
}
