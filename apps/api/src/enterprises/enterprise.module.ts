import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import EnterprisesController from './enterprise.controller';
import EnterpriseService from './enterprise.service';
import { MediaModule } from 'src/media/media.module';
import AuthModule from 'src/auth/auth.module';

@Module({
  imports: [HttpModule, MediaModule, AuthModule],
  providers: [PrismaService, EnterpriseService],
  controllers: [EnterprisesController],
  exports: [EnterpriseService],
})
export class EnterpriseModule {}
