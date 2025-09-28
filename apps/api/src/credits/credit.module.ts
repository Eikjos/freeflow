import { Module } from '@nestjs/common';
import { MediaService } from 'src/media/media.service';
import { PrismaService } from 'src/prisma.service';
import CreditController from './credit.controller';
import CreditService from './credit.service';

@Module({
  imports: [],
  providers: [PrismaService, MediaService, CreditService],
  controllers: [CreditController],
})
export default class CreditModule {}
