import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export default class CountryService {
  constructor(private readonly prisma: PrismaService) {}

  // - Methods
  async findAll() {
    return await this.prisma.country.findMany();
  }

  async findById(id: number) {
    try {
      return await this.prisma.country.findFirstOrThrow({
        where: {
          id,
        },
      });
    } catch (e) {
      throw new NotFoundException('country.notFound');
    }
  }
}
