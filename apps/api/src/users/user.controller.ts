import { Body, Controller, HttpCode, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import AuthDto from 'src/dtos/auth/auth.dto';
import CreateUserDto from 'src/dtos/users/create-user.dto';
import UserService from './user.service';

@Controller('users')
@ApiTags('User')
export default class UsersController {
  constructor(private readonly userService: UserService) {}

  // -

  @Post()
  @HttpCode(200)
  public async create(
    @Body() model: CreateUserDto,
    @Query() isEnterprise: boolean,
  ): Promise<AuthDto> {
    return this.userService.create(model, isEnterprise);
  }
}
