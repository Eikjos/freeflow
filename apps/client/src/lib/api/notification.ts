import { NotificationData } from '@repo/shared-types';
import { queryOptions } from '@tanstack/react-query';
import { client } from '../client';

export const getCustomerNotifications = (id: number) =>
  client<NotificationData[]>(`customers/${id}/notifications`);

export const getEnterpriseNotifications = (id: number) =>
  client<NotificationData[]>(`enterprises/${id}/notifications`);

export const getNotificationsQueryOptions = (
  customerId?: number,
  enterpriseId?: number,
) => {
  if (customerId) {
    return queryOptions({
      queryKey: [],
      retry: false,
      queryFn: () => getCustomerNotifications(customerId),
    });
  } else {
    return queryOptions({
      queryKey: [],
      retry: false,
      queryFn: () => getEnterpriseNotifications(enterpriseId!),
    });
  }
};
