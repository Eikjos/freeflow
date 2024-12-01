import { ApiProperty } from '@nestjs/swagger';
import { CreateUserData } from '@repo/shared-types';

export default class CreateUserDto implements CreateUserData {
  @ApiProperty({ description: 'User first name' })
  firstName: string;
  @ApiProperty({ description: 'User last name' })
  lastName: string;
  @ApiProperty({ description: 'User email' })
  email: string;
  @ApiProperty({ description: 'User password' })
  password: string;
}
