import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from 'dtos/auth/login.dto';
import { Request } from 'express';
import { AccessTokenGuard } from 'guards/access-token.guard';
import { RefreshTokenGuard } from 'guards/refresh-token.guard';
import AuthService from './auth.service';

@Controller('auth')
@ApiTags('Auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'SignIn the user' })
  @HttpCode(200)
  signIn(@Body() model: LoginDto) {
    return this.authService.signIn(model.email, model.password);
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  @HttpCode(200)
  logout(@Req() req: Request) {
    const userId = req.user['sub'];
    return this.authService.logout(userId);
  }

  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth()
  @Post('refresh')
  @HttpCode(200)
  refresh(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refresh(userId, refreshToken);
  }
}
