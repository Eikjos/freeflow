import { InvoiceCreateData } from "@repo/shared-types";
import { client } from "../../lib/client";

export const createInvoice = async (
  invoice: InvoiceCreateData,
  invoiceFile: File | undefined
) => {
  const formData = new FormData();
  const { invoiceLines, ...inv } = invoice;
  Object.entries(inv).forEach(([key, value]) => {
    if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } else {
      formData.append(key, value);
    }
  });
  formData.append(`invoiceLines`, JSON.stringify(invoiceLines));
  if (invoiceFile) formData.append("invoice", invoiceFile);

  return client<void>(
    `invoices`,
    {
      method: "POST",
      body: formData,
    },
    "other"
  ).then(async (res) => {
    if (res.ok) {
      return res.data;
    }
    throw new Error(res.error);
  });
};

export const validateQuote = async (id: number) => {
  return client<void>(`invoices/${id}/validate`, { method : 'POST'}).then(res => {
    if (res.ok) return res.data
    throw new Error(res.error);
  }).catch((e) => {
    throw new Error(e);
  })
}

export const payInvoice = async (id: number) => {
  return client<void>(`invoices/${id}/pay`, { method: 'POST'}).then((res) => {
    if (res.ok) {
      return res.data;
    }
    throw new Error(res.error);
  }).catch((e) => {
    throw new Error(e);
  })
}
