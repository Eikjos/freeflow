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
