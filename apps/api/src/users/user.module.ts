import { forwardRef, Module } from '@nestjs/common';
import AuthModule from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma.service';
import UsersController from './user.controller';
import UserService from './user.service';

@Module({
  providers: [UserService, PrismaService],
  controllers: [UsersController],
  exports: [UserService],
  imports: [forwardRef(() => AuthModule)],
})
export class UserModule {}
