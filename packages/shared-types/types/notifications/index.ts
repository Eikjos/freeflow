export type NotificationData =  {
  id: number;
  type: NotificationTypeEnum;
  enterprise: string;
  customer: string;
  createdAt: Date;
  referenceId: number;
  referenceName: string;
}

export type NotificationTypeEnum = "PAYED" | "NEW_QUOTE" | "NEW_INVOICE" | "VALIDATED" | "REFUSED" | "RELANCE_PAYED"