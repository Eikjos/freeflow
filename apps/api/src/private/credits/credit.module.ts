import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma.service';
import { MediaService } from 'private/media/media.service';
import ObjectiveService from 'private/objective/objective.service';
import SalesService from 'private/sales/sales.service';
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
