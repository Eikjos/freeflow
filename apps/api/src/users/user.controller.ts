import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import AuthDto from 'src/dtos/auth/auth.dto';
import CreateUserDto from 'src/dtos/users/create-user.dto';
import UserService from './user.service';

@Controller('user')
export default class UsersController {
  constructor(private readonly userService: UserService) {}

  // -

  @Post('create')
  @HttpCode(200)
  public async create(@Body() model: CreateUserDto): Promise<AuthDto> {
    return this.userService.create(model);
  }
}
