import { Module } from '@nestjs/common';
import { MediaService } from 'media/media.service';
import ObjectiveService from 'objective/objective.service';
import { PrismaService } from 'prisma.service';
import SalesService from 'sales/sales.service';
import CreditController from './credit.controller';
import CreditService from './credit.service';

@Module({
  imports: [],
  providers: [
    PrismaService,
    MediaService,
    ObjectiveService,
    CreditService,
    SalesService,
  ],
  controllers: [CreditController],
})
export default class CreditModule {}
