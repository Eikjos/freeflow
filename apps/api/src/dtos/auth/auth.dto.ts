import { AuthResponseData } from '@repo/shared-types';

export default class AuthDto implements AuthResponseData {
  firstName: string;
  lastName: string;
  access_token: string;
  refreshToken: string;
}
