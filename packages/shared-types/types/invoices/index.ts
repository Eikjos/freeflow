import { z } from "zod";

export type InvoiceCreateData = {
  number: string;
  title: string;
  date: Date;
  customerId: number;
  tasks: TaskInvoice[];
};

export type InvoiceLineData = {
  name: string;
  quantity: number;
  unitPrice: number;
};

export type TaskInvoice = {
  taskId: number;
  amount: number;
};

export const InvoiceCreateValidation = z.object({
  number: z.string().min(1, { message: "the number of invoice is required" }),
  title: z.string().min(1, { message: "The title is required" }),
  customerId: z.number({ required_error: "Le client est requis" }),
  date: z.date(),
  tasks: z.array(
    z.object({
      taskId: z.number(),
      amount: z.number().min(0, { message: "The amount must be positive" }),
    })
  ),
});

export const InvoiceLineValidation = z.object({
  name: z.string().min(1, { message: "name.required" }),
  quantity: z.coerce.number().min(1, { message: "quantity.required" }),
  unitPrice: z.coerce.number(),
});
