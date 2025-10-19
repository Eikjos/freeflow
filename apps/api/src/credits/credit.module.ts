import { Module } from '@nestjs/common';
import { MediaService } from 'src/media/media.service';
import ObjectiveService from 'src/objective/objective.service';
import { PrismaService } from 'src/prisma.service';
import CreditController from './credit.controller';
import CreditService from './credit.service';

@Module({
  imports: [],
  providers: [PrismaService, MediaService, ObjectiveService, CreditService],
  controllers: [CreditController],
})
export default class CreditModule {}
