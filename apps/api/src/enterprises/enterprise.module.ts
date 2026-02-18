import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import AuthModule from '../auth/auth.module';
import ExpenseModule from '../expenses/expense.module';
import MailingModule from '../mailing/mailing.module';
import { MediaModule } from '../media/media.module';
import { PrismaService } from '../prisma.service';
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
    ExpenseModule,
    SalesModule,
    MailingModule,
    forwardRef(() => AuthModule),
  ],
  providers: [PrismaService, EnterpriseService],
  controllers: [EnterprisesController],
  exports: [EnterpriseService],
})
export class EnterpriseModule {}
