import { z } from "zod";

export type InvoiceCreateData = {
  number: string;
  title: string;
  date: Date;
  customerId: number;
  InvoiceLine: InvoiceLineData[];
};

export type InvoiceLineData = {
  name: string;
  quantity: number;
  unitPrice: number;
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
