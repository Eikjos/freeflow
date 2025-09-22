import { z } from "zod";

export type CreditForInvoiceData = {
  id: number;
  totalAmount: number;
};

export type CreateCreditData = {
  title: string;
  number: string;
  invoiceId: number;
  creditLines: CreateCreditLineData[];
};

export type CreateCreditLineData = {
  title: string;
  price: number;
};

export const CreateCreditLineDataValidation = z.object({
  title: z.string().min(1, { message: "title.required" }),
  price: z.coerce.number().min(1, { message: "price.must.be.positive" }),
});

export const CreateCreditDataValidation = z.object({
  number: z.string().min(1, { message: "the number of invoice is required" }),
  title: z.string().min(1, { message: "The title is required" }),
  creditLines: z.array(CreateCreditLineDataValidation),
});
