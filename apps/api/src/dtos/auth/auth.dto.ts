import { ApiProperty } from '@nestjs/swagger';
import { AuthResponseData } from '@repo/shared-types';

export default class AuthDto implements AuthResponseData {
  @ApiProperty({ description: 'User first name' })
  firstName: string;
  @ApiProperty({ description: 'User last name' })
  lastName: string;
  @ApiProperty({ description: 'Access token for the user' })
  access_token: string;
  @ApiProperty({ description: 'User role' })
  role: 'enterprise' | 'customer';
  @ApiProperty({
    description: 'The refresh token for refresh the session of user',
  })
  refreshToken: string;
}
