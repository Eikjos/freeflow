import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import AuthModule from 'private/auth/auth.module';
import NotificationModule from 'private/notifications/notification.module';
import OpinionModule from 'private/opinions/opinion.module';
import { PrismaService } from '../../prisma.service';
import ExpenseModule from '../expenses/expense.module';
import MailingModule from '../mailing/mailing.module';
import { MediaModule } from '../media/media.module';
import ProjectModule from '../projects/project.module';
import { SalesModule } from '../sales/sales.module';
import EnterprisesController from './enterprise.controller';
import EnterpriseService from './enterprise.service';

@Module({
  imports: [
    MulterModule.register({}),
    HttpModule,
    MediaModule,
    ProjectModule,
    OpinionModule,
    ExpenseModule,
    SalesModule,
    MailingModule,
    NotificationModule,
    forwardRef(() => AuthModule),
  ],
  providers: [PrismaService, EnterpriseService],
  controllers: [EnterprisesController],
  exports: [EnterpriseService],
})
export class EnterpriseModule {}
