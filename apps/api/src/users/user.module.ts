import { forwardRef, Module } from '@nestjs/common'
import AuthModule from '../auth/auth.module'
import { PrismaService } from '../prisma.service'
import UsersController from './user.controller'
import UserService from './user.service'

@Module({
  providers: [UserService, PrismaService],
  controllers: [UsersController],
  exports: [UserService],
  imports: [forwardRef(() => AuthModule)],
})
export class UserModule {}
