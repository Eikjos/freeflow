import { ApiProperty } from '@nestjs/swagger';
import { CreateTaskData } from '@repo/shared-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum PriorityEnum {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export default class CreateTaskDto implements CreateTaskData {
  @ApiProperty({ description: 'The name of task' })
  @IsString()
  name: string;
  @ApiProperty({ description: 'The description of task' })
  @IsString()
  description?: string;
  @ApiProperty({ description: 'The priority of task' })
  @IsEnum(PriorityEnum)
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  @ApiProperty({ description: 'The estimation of task' })
  @Type(() => Number)
  @IsNumber()
  estimation: number;
  @ApiProperty({ description: 'file attachment' })
  files: File[];
  @ApiProperty({ description: 'file already saved' })
  @Type(() => Number)
  @IsArray()
  @IsOptional()
  mediaIds?: number[];
}
