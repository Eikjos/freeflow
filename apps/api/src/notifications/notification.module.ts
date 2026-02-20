import { Module } from "@nestjs/common";
import { PrismaService } from "prisma.service";
import NotificationService from "./notification.service";

@Module({
  controllers: [],
  providers: [PrismaService, NotificationService],
  exports: [NotificationService]
})
export default class NotificationModule { }