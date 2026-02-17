import { CreateExpenseData } from '@repo/shared-types'
import { client } from '../../lib/client'

export const createExpense = (expense: CreateExpenseData) => {
  const formData = new FormData()
  const { expense: file, ...exp } = expense
  Object.entries(exp).forEach(([key, value]) => {
    if (value instanceof Date) {
      formData.append(key, value.toISOString())
    } else {
      if (value) {
        formData.append(key, value as string)
      }
    }
  })
  if (file) formData.append('expense', file)

  return client<void>(
    `expenses`,
    {
      method: 'POST',
      body: formData,
    },
    'other',
  ).then((res) => {
    if (res.ok) {
      return res.data
    }
    throw new Error(res.error)
  })
}

export const deleteExpense = (id: number) =>
  client<void>(`expenses/${id}`, { method: 'DELETE' }).then((res) => {
    if (res.ok) {
      return res.data
    }
    throw new Error(res.error)
  })
