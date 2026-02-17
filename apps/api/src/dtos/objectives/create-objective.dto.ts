import { ApiProperty } from '@nestjs/swagger'
import { ObjectiveCategory } from '@prisma/client'
import { CreateObjectiveData } from '@repo/shared-types'
import { IsDate, IsEnum, IsNumber, IsOptional } from 'class-validator'

export default class CreateObjectiveDto implements CreateObjectiveData {
  @ApiProperty({ description: 'The start date of objective' })
  @IsDate()
  @IsOptional()
  startDate?: Date
  @IsDate()
  @ApiProperty({ description: 'The end date of objective' })
  endDate: Date
  @ApiProperty({ description: 'The objectif taget value of objective' })
  @IsNumber()
  objectiveNumber: number
  @ApiProperty({ description: 'The objective category of objective' })
  @IsEnum(ObjectiveCategory)
  objectiveCategory: ObjectiveCategory
}
