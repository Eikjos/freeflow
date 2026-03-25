import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AccessTokenStrategy } from 'auth/strategies/access-token.strategy';
import { RefreshTokenStrategy } from 'auth/strategies/refresh-token.strategy';
import CustomerModule from 'private/customers/customer.module';
import { EnterpriseModule } from 'private/enterprises/enterprise.module';
import { SalesModule } from 'private/sales/sales.module';
import { UserModule } from 'private/users/user.module';
import AuthController from './auth.controller';
import AuthService from './auth.service';

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
