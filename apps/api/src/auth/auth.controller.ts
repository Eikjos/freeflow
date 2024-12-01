import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import AuthDto from 'src/dtos/auth/auth.dto';
import { LoginDto } from 'src/dtos/auth/login.dto';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { RefreshTokenGuard } from 'src/guards/refresh-token.guard';
import AuthService from './auth.service';

@Controller('auth')
@ApiTags('Authentication')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async signIn(@Body() model: LoginDto): Promise<AuthDto> {
    return this.authService.signIn(model.email, model.password);
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  @HttpCode(200)
  async logout(@Req() req: Request) {
    const userId = req.user['sub'];
    return this.authService.logout(userId);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(200)
  async refresh(@Req() req: Request): Promise<AuthDto> {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refresh(userId, refreshToken);
  }
}
