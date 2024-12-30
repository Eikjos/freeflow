import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export default class CountryService {
  constructor(private readonly prisma: PrismaService) {}

  // - Methods
  async findAll() {
    return await this.prisma.country.findMany();
  }
}
