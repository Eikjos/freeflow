import { InvoiceCreateData, QuoteValidateData } from '@repo/shared-types'
import { client } from '../../lib/client'

export const createInvoice = (
  invoice: InvoiceCreateData,
  invoiceFile: File | undefined,
) => {
  const formData = new FormData()
  const { invoiceLines, ...inv } = invoice
  Object.entries(inv).forEach(([key, value]) => {
    if (value instanceof Date) {
      formData.append(key, value.toISOString())
    } else {
      formData.append(key, value as string)
    }
  })
  formData.append(`invoiceLines`, JSON.stringify(invoiceLines))
  if (invoiceFile) formData.append('invoice', invoiceFile)

  return client<void>(
    `invoices`,
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

export const sendValidationQuote = async (id: number) =>
  client<void>(`invoices/${id}/send-validation`, { method: 'POST' })

export const validateQuote = (id: number, value: boolean, code?: string) =>
  client<void>(`invoices/${id}/validate`, {
    method: 'POST',
    body: JSON.stringify({
      value: value,
      code,
    } as QuoteValidateData),
  })
    .then((res) => {
      if (res.ok) return res.data
      throw new Error(res.error)
    })
    .catch((e: Error) => {
      throw new Error(e.message)
    })

export const payInvoice = (id: number) =>
  client<void>(`invoices/${id}/pay`, { method: 'POST' })
    .then((res) => {
      if (res.ok) {
        return res.data
      }
      throw new Error(res.error)
    })
    .catch((e: Error) => {
      throw new Error(e.message)
    })
