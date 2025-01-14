import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import CountryModule from './countries/country.module';
import { EnterpriseModule } from './enterprises/enterprise.module';
import JuridicShapeModule from './juridic-shapes/juridic-shapes.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    EnterpriseModule,
    CountryModule,
    JuridicShapeModule,
  ],
  providers: [],
})
export class AppModule {}
