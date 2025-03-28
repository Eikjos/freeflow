import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateUserData } from '@repo/shared-types';
import * as bcrypt from 'bcrypt';
import AuthService from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export default class UserService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  // -

  public async create(model: CreateUserData, isEnterprise: boolean) {
    // verify if user already exist
    const user = await this.prisma.user.findFirst({
      where: { email: model.email },
    });
    if (user) {
      throw new BadRequestException('user.alreadyExist');
    }
    // create user
    const passwordSalt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(model.password, passwordSalt);
    const newUser = await this.prisma.user.create({
      data: {
        firstName: model.firstName,
        lastName: model.lastName,
        isEnterprise: isEnterprise,
        isCustomer: !isEnterprise,
        email: model.email,
        password: hashPassword,
        passwordSalt: passwordSalt,
      },
    });
    // generate token
    return this.authService.generateToken(newUser);
  }

  public async findUserByEmail(email: string) {
    return await this.prisma.user.findFirst({
      where: { email },
      include: { enterprise: true },
    });
  }

  public async findUserById(id: number) {
    return await this.prisma.user.findFirst({
      where: { id },
      include: { enterprise: true },
    });
  }

  public async udpateRefreshToken(userId: number, refreshToken: string) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: bcrypt.hashSync(refreshToken, 10),
      },
    });
  }
}
