import { CreateUserData } from '@repo/shared-types';

export default class CreateUserDto implements CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
