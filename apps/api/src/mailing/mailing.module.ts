import { Module } from '@nestjs/common';
import MailingService from './mailing.service';

@Module({
  providers: [MailingService],
  exports: [MailingService],
})
export default class MailingModule {}
