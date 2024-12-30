import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import CountryModule from './countries/country.module';
import { EnterpriseModule } from './enterprises/enterprise.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    EnterpriseModule,
    CountryModule,
  ],
  providers: [],
})
export class AppModule {}
