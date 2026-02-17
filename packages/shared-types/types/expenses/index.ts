import { z } from 'zod'

export type ExpenseCategoryData = {
  id: number
  key: string
  name: string
  tva: number
  recoverablePercent: number
}

export type ExpenseData = {
  id: number
  name: string
  description?: string
  date: Date
  amount: number
  category: ExpenseCategoryData
}

export type ExpenseFilterData = {
  search?: string
  startDate?: Date
  endDate?: Date
  category?: number
  amountMin?: number
  amountMax?: number
}

export type CreateExpenseData = {
  name: string
  description?: string
  categoryId: number
  amount: number
  date: Date
  expense?: File
  [key: string]: string | number | Date | File | undefined
}

export const CreateExpenseDataValidation = z.object({
  name: z.string().min(1, { message: 'name.required' }),
  description: z.string().optional(),
  date: z.date().refine((date) => date <= new Date(), {
    message: 'date.not.in.future',
  }),
  categoryId: z
    .string({ required_error: 'category.required' })
    .transform((val) => Number(val)),
  amount: z.coerce.number().min(0.01, { message: 'amount.required' }),
  expense: z.any(),
})
