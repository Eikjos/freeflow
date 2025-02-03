import {
  Body,
  Controller,
  HttpCode,
  ParseBoolPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
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
  @ApiQuery({
    name: 'isEnterprise',
    required: true,
    type: Boolean,
    description: 'Indicates whether the user is an enterprise user',
  })
  public async create(
    @Body() model: CreateUserDto,
    @Query('isEnterprise', ParseBoolPipe) isEnterprise: boolean,
  ): Promise<AuthDto> {
    return this.userService.create(model, isEnterprise);
  }
}
