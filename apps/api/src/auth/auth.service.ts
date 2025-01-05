import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { AuthResponseData } from '@repo/shared-types';
import * as bcrypt from 'bcrypt';
import UserService from 'src/users/user.service';

@Injectable()
export default class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // --

  public async signIn(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException('credentials.invalid', {
        description: 'credentials.invalid',
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('credentials.invalid', {
        description: 'credentials.invalid',
      });
    }
    return this.generateToken(user);
  }

  public async logout(userId: number) {
    return this.userService.udpateRefreshToken(userId, null);
  }

  public async refresh(userId: number, refreshToken: string) {
    const user = await this.userService.findUserById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await bcrypt.compareSync(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    return this.generateToken(user);
  }

  public async generateToken(user: User): Promise<AuthResponseData> {
    const payload = { sub: user.id };

    const access_token = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    this.userService.udpateRefreshToken(user.id, refreshToken);

    return {
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.isEnterprise ? 'enterprise' : 'customer',
      enterpriseId: user.enterpriseId,
      access_token,
      refreshToken,
    };
  }
}
