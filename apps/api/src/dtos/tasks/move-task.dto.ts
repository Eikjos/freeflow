import { MoveTaskData } from '@repo/shared-types'
import { IsInt } from 'class-validator'

export default class MoveTaskDto implements MoveTaskData {
  @IsInt()
  toPosition: number
}
