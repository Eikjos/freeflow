import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './users/user.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule],
  providers: [],
})
export class AppModule {}
