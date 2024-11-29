import { LoginData } from '@repo/shared-types';

export class LoginDto implements LoginData {
  email: string;
  password: string;
}
