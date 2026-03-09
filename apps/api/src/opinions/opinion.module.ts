import { Module } from '@nestjs/common';
import MailingModule from 'mailing/mailing.module';
import { PrismaService } from 'prisma.service';
import OpinionController from './opinion.controller';
import OpinionService from './opinion.service';

@Module({
  imports: [MailingModule],
  controllers: [OpinionController],
  providers: [PrismaService, OpinionService],
  exports: [OpinionService],
})
export default class OpinionModule {}
