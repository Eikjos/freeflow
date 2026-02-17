import { ExpenseCategoryData } from '@repo/shared-types'
import { client } from '../client'

export const fetchExpenseCategories = async () =>
  await client<ExpenseCategoryData[]>('expense-categories')
