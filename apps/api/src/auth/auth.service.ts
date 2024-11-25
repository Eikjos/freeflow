import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import UserService from 'src/users/user.service';

@Injectable()
export default class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  // --

  public async signIn(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException('credentials invalid', {
        description: 'credentials invalid',
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('credentials invalid', {
        description: 'credentials invalid',
      });
    }
    return this.generateToken(user);
  }

  public async generateToken(user: User) {
    const payload = { sub: user.id };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, passwordSalt, ...result } = user;
    return {
      ...result,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
