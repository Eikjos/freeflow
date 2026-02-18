import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import CustomerModule from 'customers/customer.module';
import { EnterpriseModule } from 'enterprises/enterprise.module';
import { SalesModule } from 'sales/sales.module';
import { UserModule } from 'users/user.module';
import AuthController from './auth.controller';
import AuthService from './auth.service';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  controllers: [AuthController],
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_JWT,
      signOptions: { expiresIn: '15m' },
    }),
    PassportModule,
    SalesModule,
    CustomerModule,
    forwardRef(() => EnterpriseModule),
    forwardRef(() => UserModule),
  ],
  exports: [AuthService],
})
export default class AuthModule {}
