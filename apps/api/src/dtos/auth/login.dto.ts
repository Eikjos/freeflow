import { ApiProperty } from '@nestjs/swagger'
import { LoginData } from '@repo/shared-types'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class LoginDto implements LoginData {
  @ApiProperty({
    description: 'User email',
  })
  @IsEmail()
  email: string
  @ApiProperty({
    description: 'User password',
  })
  @IsNotEmpty()
  password: string
}
