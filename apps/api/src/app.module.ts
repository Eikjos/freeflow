import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrivateModule } from 'private/private.module';
import { PublicModule } from 'public/public.module';

@Module({
  imports: [ScheduleModule.forRoot(), PrivateModule, PublicModule],
  providers: [],
})
export class AppModule {}
