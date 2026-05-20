import { QuoteValidateData } from '@repo/shared-types';
import { client } from '../../lib/client';

export const createInvoice = (formData: FormData) => {
  return client<void>(
    `invoices`,
    {
      method: 'POST',
      body: formData,
    },
    'other',
  ).then((res) => {
    if (res.ok) {
      return res.data;
    }
    throw new Error(res.error);
  });
};

export const sendValidationQuote = async (id: number) =>
  client<void>(`invoices/${id}/send-validation`, { method: 'POST' });

export const validateQuote = (id: number, value: boolean, code?: string) =>
  client<void>(`invoices/${id}/validate`, {
    method: 'POST',
    body: JSON.stringify({
      value: value,
      code,
    } as QuoteValidateData),
  })
    .then((res) => {
      if (res.ok) return res.data;
      throw new Error(res.error);
    })
    .catch((e: Error) => {
      throw new Error(e.message);
    });

export const payInvoice = (id: number) =>
  client<void>(`invoices/${id}/pay`, { method: 'POST' })
    .then((res) => {
      if (res.ok) {
        return res.data;
      }
      throw new Error(res.error);
    })
    .catch((e: Error) => {
      throw new Error(e.message);
    });
