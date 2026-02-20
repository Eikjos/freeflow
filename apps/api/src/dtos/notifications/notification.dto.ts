import { ApiProperty } from "@nestjs/swagger";
import { Customer, Enterprise, Notification } from "@prisma/client";
import { NotificationData, NotificationTypeEnum } from "@repo/shared-types";

export default class NotificationDto implements NotificationData {
  @ApiProperty({ description : "Notification id "})
  id : number;
  @ApiProperty({ description : "Notification type"})
  type: NotificationTypeEnum;
  @ApiProperty({ description : 'Notification reference id (Invoice, Quote, ...)'})
  referenceId : number;
  @ApiProperty({ description : "Notification reference name"})
  referenceName: string;
  @ApiProperty({ description : "Notification enterprise name"})
  enterprise: string;
  @ApiProperty({description: "Notification customer name"})
  customer: string;
  @ApiProperty({description: "Notification createdAt"})
  createdAt: Date

  constructor(notification : Notification, enterprise: Enterprise, customer: Customer, referenceName : string) {
    this.id = notification.id;
    this.type = notification.type;
    this.referenceId = notification.referenceId;
    this.createdAt = notification.createdAt;
    this.referenceName = referenceName;
    this.enterprise = enterprise.name;
    this.customer = customer.name;
  }

}