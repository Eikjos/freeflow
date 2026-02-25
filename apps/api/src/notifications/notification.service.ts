import { Injectable } from '@nestjs/common';
import { NotificationTypeEnum } from '@prisma/client';
import NotificationDto from 'dtos/notifications/notification.dto';
import { PrismaService } from 'prisma.service';

@Injectable()
export default class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async createEntepriseNotification(
    enterpriseId: number,
    type: NotificationTypeEnum,
    customerId: number,
    referenceId: number,
  ) {
    await this.prisma.notification.create({
      data: {
        type,
        enterpriseId,
        customerId,
        to: 'ENTERPRISE',
        referenceId,
      },
    });
  }

  async createCustomerNotification(
    customerId: number,
    type: NotificationTypeEnum,
    enterpriseId: number,
    referenceId: number,
  ) {
    await this.prisma.notification.create({
      data: {
        type,
        enterpriseId,
        customerId,
        to: 'CUSTOMER',
        referenceId,
      },
    });
  }

  async findAllForEnterpriseId(enterpriseId: number) {
    return await this.prisma.$queryRaw<NotificationDto[]>`
      SELECT 
          n.id,
          n.type,
          n."referenceId",
          e."name" AS "enterprise",
          c.name AS "customer",
          CASE
              WHEN n."type" = 'VALIDATED' OR n."type" = 'REFUSED' THEN i.number
              ELSE 0
          END AS "referenceName"
      FROM "Notification" n
      INNER JOIN "Customer" c ON c.id = n."customerId"
      INNER JOIN "Enterprise" e ON e.id = n."enterpriseId"
      LEFT JOIN "Invoice" i ON i.id = n."referenceId"
      WHERE n."to" = 'ENTERPRISE' AND n."enterpriseId" = ${enterpriseId}
      ORDER BY n."createdAt" DESC;
    `;
  }
}
