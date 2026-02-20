import { Injectable } from "@nestjs/common";
import { NotificationTypeEnum } from "@prisma/client";
import NotificationDto from "dtos/notifications/notification.dto";
import { PrismaService } from "prisma.service";

@Injectable()
export default class NotificationService {
  constructor(private readonly prisma : PrismaService) {}

  async createEntepriseNotification(enterpriseId : number, type: NotificationTypeEnum, customerId : number, referenceId : number) {
    await this.prisma.notification.create({
      data: {
        type,
        enterpriseId,
        customerId,
        to: "ENTERPRISE",
        referenceId
      }
    })
  }

  async createCustomerNotification(customerId: number, type : NotificationTypeEnum, enterpriseId : number, referenceId : number) {
    await this.prisma.notification.create({
      data: {
        type,
        enterpriseId,
        customerId,
        to: "CUSTOMER",
        referenceId
      }
    })
  }

  async findAllForEnterpriseId(enterpriseId : number) {
    const datas = await this.prisma.notification.findMany({
      where: { to: "ENTERPRISE", enterpriseId }, 
      include: { enterprise : true, customer: true },
      orderBy: { createdAt: "desc"}
    });
    return datas.map(d =>  new NotificationDto(d, d.enterprise, d.customer, "test"));
  }
}