import { ApiProperty } from '@nestjs/swagger'
import { CreateUserData } from '@repo/shared-types'
import { IsEmail, IsString, IsStrongPassword } from 'class-validator'

export default class CreateUserDto implements CreateUserData {
  @ApiProperty({ description: 'User first name' })
  @IsString()
  firstName: string
  @ApiProperty({ description: 'User last name' })
  @IsString()
  lastName: string
  @ApiProperty({ description: 'User email' })
  @IsEmail()
  email: string
  @ApiProperty({ description: 'User password' })
  @IsString()
  @IsStrongPassword()
  password: string
}
