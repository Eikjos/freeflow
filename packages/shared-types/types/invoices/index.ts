import { CreditForInvoiceData } from "types/credits";
import { CustomerModel } from "types/customers";
import { EnterpriseInformation } from "types/enterprises";
import { z } from "zod";

export type InvoiceStatus =
  | "WAITING_VALIDATION"
  | "VALIDATE"
  | "REJECTED"
  | "WAITING_PAYED"
  | "PAYED"
  | "CREDITED"
  | "PARTIAL_CREDITED";
export type InvoiceType = "QUOTE" | "INVOICE";

export type InvoiceData = {
  id: number;
  number: string;
  title: string;
  date: Date;
  invoiceLines: InvoiceLineData[];
  totalAmount: number;
  status: InvoiceStatus;
  type: InvoiceType;
  excludeTva: boolean;
  mediaId: number;
  customer: CustomerModel;
  credits: CreditForInvoiceData[];
};

export type InvoiceLineData = {
  id: number;
  name: string;
  quantity: number;
  unitPrice: number;
};

export type InvoiceCreateData = {
  number: string;
  title: string;
  date: Date;
  customerId: number;
  type: InvoiceType;
  excludeTva?: boolean;
  invoiceLines: InvoiceLineCreateData[];
  devisId?: number;
  [key: string]: any;
};

export type InvoiceLineCreateData = {
  name: string;
  quantity: number;
  unitPrice: number;
};

export type InvoiceInformation = {
  enterprise: EnterpriseInformation;
  prefixe: string;
  lastNumber: number;
};

export const InvoiceCreateValidation = z.object({
  number: z.string().min(1, { message: "the number of invoice is required" }),
  title: z.string().min(1, { message: "The title is required" }),
  customerId: z.number({ required_error: "Le client est requis" }),
  date: z.date(),
  invoiceLines: z.array(
    z.object({
      name: z.string().min(1, { message: "Le nom est requis." }),
      quantity: z.coerce
        .number()
        .min(1, { message: "The quantity must be positive" }),
      unitPrice: z.coerce.number(),
    })
  ),
});

export const InvoiceLineValidation = z.object({
  name: z.string().min(1, { message: "name.required" }),
  quantity: z.coerce.number().min(1, { message: "quantity.required" }),
  unitPrice: z.coerce.number(),
});

export type InvoiceFilterData = {
  number: string;
  customerId: number;
  type: InvoiceType;
  status: InvoiceStatus;
  startDate: Date;
  endDate: Date;
  [key: string]: string | number | Date;
};
