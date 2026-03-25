import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import OpinionModule from './opinions/opinion.module';

@Module({
  imports: [ConfigModule.forRoot(), OpinionModule],
})
export class PublicModule {}
