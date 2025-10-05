import { ApiProperty } from '@nestjs/swagger';
import { CreateExpenseData } from '@repo/shared-types';
import { Transform } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

export default class CreateExpenseDto implements CreateExpenseData {
  [key: string]: string | number | Date | File;
  @ApiProperty({ description: 'The date of expense' })
  @IsDate()
  date: Date;
  @ApiProperty({ description: 'The name of expense ' })
  @IsString()
  name: string;
  @ApiProperty({ description: 'The description of expense ' })
  @IsString()
  description?: string;
  @ApiProperty({ description: 'The category id of expense ' })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  categoryId: number;
  @ApiProperty({ description: 'The amount id of expense ' })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  amount: number;
  @ApiProperty({ description: 'The expense file of expense ' })
  expense?: File;
}
