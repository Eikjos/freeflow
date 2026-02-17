import { ApiProperty } from '@nestjs/swagger'
import { Objective } from '@prisma/client'
import { ObjectiveCategory, ObjectiveData } from '@repo/shared-types'

export default class ObjectiveDto implements ObjectiveData {
  @ApiProperty({ description: 'The id of objective' })
  id: number
  @ApiProperty({ description: 'The start date of objective' })
  startDate: Date
  @ApiProperty({ description: 'The end date of objective' })
  endDate: Date
  @ApiProperty({ description: 'The current value of objective' })
  currentNumber: number
  @ApiProperty({ description: 'The target objective of objective' })
  objectiveNumber: number
  @ApiProperty({ description: 'The category of objective' })
  objectiveCategory: ObjectiveCategory
  @ApiProperty({ description: 'The enterpriseId of objective' })
  enterpriseId: number

  constructor(objective: Objective) {
    this.id = objective.id
    this.startDate = objective.startDate
    this.endDate = objective.endDate
    this.currentNumber = objective.currentNumber
    this.objectiveNumber = objective.objectiveNumber
    this.objectiveCategory = objective.category
    this.enterpriseId = objective.enterpriseId
  }
}
