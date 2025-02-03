import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export default class JuridicShapeService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.juridicShape.findMany({});
  }

  async findByCode(code: string) {
    try {
      return await this.prisma.juridicShape.findFirstOrThrow({
        where: {
          code,
        },
      });
    } catch (e) {
      throw new NotFoundException();
    }
  }
}
