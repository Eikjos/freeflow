import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import CountryController from './country.controller';
import CountryService from './country.service';

@Module({
  providers: [PrismaService, CountryService],
  controllers: [CountryController],
  exports: [CountryService],
})
export default class CountryModule {}
