import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import ColumnModule from './columns/columns.module';
import CountryModule from './countries/country.module';
import CustomerModule from './customers/customer.module';
import { EnterpriseModule } from './enterprises/enterprise.module';
import JuridicShapeModule from './juridic-shapes/juridic-shapes.module';
import { MediaModule } from './media/media.module';
import ProjectModule from './projects/project.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    MediaModule,
    ConfigModule.forRoot(),
    UserModule,
    EnterpriseModule,
    CountryModule,
    JuridicShapeModule,
    CustomerModule,
    ProjectModule,
    ColumnModule,
  ],
  providers: [],
})
export class AppModule {}
