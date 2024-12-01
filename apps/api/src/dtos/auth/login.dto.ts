import { ApiProperty } from '@nestjs/swagger';
import { LoginData } from '@repo/shared-types';

export class LoginDto implements LoginData {
  @ApiProperty({
    description: 'User email',
  })
  email: string;
  @ApiProperty({
    description: 'User password',
  })
  password: string;
}
