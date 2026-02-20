import {
  EnterpriseData,
  EnterpriseInformation,
  EnterpriseStatData,
  InvoiceInformation,
  NotificationData,
} from '@repo/shared-types';
import { queryOptions } from '@tanstack/react-query';
import { client } from '../client';

export const fetchEnterpriseInfo = async (siret: string) =>
  await client<EnterpriseInformation>(`enterprises/information?siret=${siret}`);

export const getEnterpriseInscription = async () =>
  await client<number>('enterprises/inscription-year');

export const getInformationForInvoice = async (id: number) =>
  await client<InvoiceInformation>(
    `enterprises/${id}/get-information-for-invoice`,
  );

export const getInformationForInvoiceQueryOptions = (id: number) => ({
  queryFn: () => getInformationForInvoice(id),
  queryKey: ['enterprise', 'invoice', id],
  retry: false,
});

export const getInformationForDevis = async (id: number) =>
  await client<InvoiceInformation>(
    `enterprises/${id}/get-information-for-devis`,
  );

export const getEnterprise = async (id: number) =>
  await client<EnterpriseData>(`enterprises/${id}`);

export const getInformationForDevisQueryOptions = (id: number) => ({
  queryFn: () => getInformationForDevis(id),
  queryKey: ['enterprise', 'devis', id],
  retry: false,
});

export const getEntepriseQueryOptions = (id: number) => ({
  queryFn: () => getEnterprise(id),
  queryKey: ['enterprise', id],
  retry: false,
});

export const getEnterpriseStat = async (year?: number) =>
  await client<EnterpriseStatData>(
    `enterprises/stats${year !== undefined ? `?year=${year}` : ''}`,
  );

export const getEnterpriseStatQueryOptions = (year?: number) =>
  queryOptions({
    queryKey: ['enterprise', 'stat', year],
    retry: false,
    queryFn: () => getEnterpriseStat(year),
  });

export const getEnterpriseNotifications =  async (id :number) => 
  await client<NotificationData[]>(`enterprises/${id}/notifications`);

export const getEnterpriseNotificationsQueryOptions = (id : number) => 
  queryOptions({
    queryKey: ['enterprise', 'notifications'],
    retry: false,
    queryFn: () => getEnterpriseNotifications(id)
  });
