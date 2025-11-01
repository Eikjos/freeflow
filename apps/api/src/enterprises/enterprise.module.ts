import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import AuthModule from 'src/auth/auth.module';
import ExpenseModule from 'src/expenses/expense.module';
import { MediaModule } from 'src/media/media.module';
import { PrismaService } from 'src/prisma.service';
import ProjectModule from 'src/projects/project.module';
import { SalesModule } from 'src/sales/sales.module';
import EnterprisesController from './enterprise.controller';
import EnterpriseService from './enterprise.service';

@Module({
  imports: [
    MulterModule.register({}),
    HttpModule,
    MediaModule,
    AuthModule,
    ProjectModule,
    ExpenseModule,
    SalesModule,
  ],
  providers: [PrismaService, EnterpriseService],
  controllers: [EnterprisesController],
  exports: [EnterpriseService],
})
export class EnterpriseModule {}
