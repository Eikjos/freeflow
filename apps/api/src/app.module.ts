import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import ColumnModule from './columns/columns.module';
import CountryModule from './countries/country.module';
import CreditModule from './credits/credit.module';
import CustomerModule from './customers/customer.module';
import { EnterpriseModule } from './enterprises/enterprise.module';
import ExpenseCategoryModule from './expense-category/expense-category.module';
import ExpenseModule from './expenses/expense.module';
import InvoiceModule from './invoices/invoice.module';
import JuridicShapeModule from './juridic-shapes/juridic-shapes.module';
import { MediaModule } from './media/media.module';
import ObjectiveModule from './objective/objective.module';
import ProjectModule from './projects/project.module';
import { SalesModule } from './sales/sales.module';
import TaskModule from './tasks/task.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    MediaModule,
    ConfigModule.forRoot(),
    UserModule,
    SalesModule,
    ExpenseModule,
    EnterpriseModule,
    ObjectiveModule,
    CountryModule,
    JuridicShapeModule,
    CustomerModule,
    ProjectModule,
    ColumnModule,
    TaskModule,
    InvoiceModule,
    CreditModule,
    ExpenseCategoryModule,
  ],
  providers: [],
})
export class AppModule {}
