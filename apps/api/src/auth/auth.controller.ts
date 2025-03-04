import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import AuthDto from 'src/dtos/auth/auth.dto';
import { LoginDto } from 'src/dtos/auth/login.dto';
import { AccessTokenGuard } from 'src/guards/access-token.guard';
import { RefreshTokenGuard } from 'src/guards/refresh-token.guard';
import AuthService from './auth.service';

@Controller('auth')
@ApiTags('Auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'SignIn the user' })
  @HttpCode(200)
  async signIn(@Body() model: LoginDto, @Res() res: Response) {
    const credentials = await this.authService.signIn(
      model.email,
      model.password,
    );
    res.cookie('access_token', credentials.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    res.cookie('refreshToken', credentials.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    return res.status(200).send(credentials);
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  @HttpCode(200)
  async logout(@Req() req: Request) {
    const userId = req.user['sub'];
    return this.authService.logout(userId);
  }

  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth()
  @Post('refresh')
  @HttpCode(200)
  async refresh(@Req() req: Request, @Res() res: Response) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    const credentials = await this.authService.refresh(userId, refreshToken);
    res.cookie('access_token', credentials.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    res.cookie('refreshToken', credentials.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    return res.status(200).send(credentials);
  }
}
