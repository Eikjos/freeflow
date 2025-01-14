import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export default class JuridicShapeService {
  constructor(private readonly prisma: PrismaService) {}

  public async findAll() {
    return await this.prisma.juridicShape.findMany({});
  }
}
