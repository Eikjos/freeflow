import { Expense, ExpenseCategory } from '@prisma/client'
import { ExpenseData } from '@repo/shared-types'
import ExpenseCategoryDto from '../expense-categories/expense-category.dto'

export class ExpenseDto implements ExpenseData {
  id: number
  name: string
  description?: string
  date: Date
  amount: number
  category: ExpenseCategoryDto
}

export const toExpenseDto = (
  expense: Expense,
  category: ExpenseCategory,
): ExpenseDto => {
  return {
    id: expense.id,
    name: expense.name,
    description: expense.description,
    date: expense.date,
    amount: Number(expense.price),
    category: {
      id: category.id,
      key: category.key,
      name: category.name,
      recoverablePercent: category.recoverablePercent,
      tva: category.tva,
    },
  }
}
