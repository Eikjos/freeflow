import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/users/user.module';
import AuthController from './auth.controller';
import AuthService from './auth.service';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_JWT,
      signOptions: { expiresIn: '15m' },
    }),
    forwardRef(() => UserModule),
  ],
  exports: [AuthService],
})
export default class AuthModule {}
