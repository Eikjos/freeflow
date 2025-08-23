import { EnterpriseInformation, InvoiceInformation } from "@repo/shared-types";
import { client } from "../client";

export const fetchEnterpriseInfo = async (siret: string) =>
  await client<EnterpriseInformation>(`enterprises/information?siret=${siret}`);

export const getInformationForInvoice = async (id: number) =>
  await client<InvoiceInformation>(
    `enterprises/${id}/get-information-for-invoice`
  );

export const getInformationForInvoiceQueryOptions = (id: number) => ({
  queryFn: () => getInformationForInvoice(id),
  queryKey: ["enterprise", "invoice", id],
  retry: false,
});

export const getInformationForDevis = async (id: number) =>
  await client<InvoiceInformation>(
    `enterprises/${id}/get-information-for-devis`
  );

export const getInformationForDevisQueryOptions = (id: number) => ({
  queryFn: () => getInformationForDevis(id),
  queryKey: ["enterprise", "devis", id],
  retry: false,
});
