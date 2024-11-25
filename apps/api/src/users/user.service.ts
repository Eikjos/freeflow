import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export default class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // -

  public async create() {}

  public async findUserByEmail(email: string): Promise<User> {
    return await this.prisma.user.findFirst({ where: { email } });
  }
}
