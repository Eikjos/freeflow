import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma.service';
import MailingModule from 'private/mailing/mailing.module';
import OpinionController from './opinion.controller';
import OpinionService from './opinion.service';

@Module({
  imports: [MailingModule],
  controllers: [OpinionController],
  providers: [PrismaService, OpinionService],
  exports: [OpinionService],
})
export default class OpinionModule {}
