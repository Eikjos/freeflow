import { Card, CardContent, CardHeader } from '@components/ui/card';
import { NotificationData } from '@repo/shared-types';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { cn } from '../../../lib/utils';

type NotificationItemCardProps = {
  notification: NotificationData;
  className?: string;
};

export default function NotifcationItemCard({
  className,
  notification,
}: NotificationItemCardProps) {
  if (!notification) {
    console.warn('Notification undefined !');
    return null;
  }
  switch (notification.type) {
    case 'PAYED':
      return (
        <NotificationInvoicePayed
          notification={notification}
          className={className}
        />
      );
    case 'VALIDATED':
      return (
        <NotificationQuoteValidated
          notification={notification}
          className={className}
        />
      );
    case 'REFUSED':
      return (
        <NotificationQuoteRefused
          notification={notification}
          className={className}
        />
      );
    default:
      return (
        <Card className={cn('h-24', className)}>
          <CardContent className="p-1 relative">
            <CardHeader className="p-1 text-primary">
              {notification.customer}
            </CardHeader>
            <p className="text-sm pl-2">
              {notification.referenceName} pour le client{' '}
              {notification.customer}
            </p>
            <div className="h-2 w-2 bg-secondary rounded-full absolute top-1/2 right-5"></div>
          </CardContent>
        </Card>
      );
  }
}

const NotificationInvoicePayed = ({
  notification,
  className,
}: NotificationItemCardProps) => {
  const t = useTranslations();
  return (
    <Link href={`invoices`} className={className}>
      <Card className={'h-24'}>
        <CardContent className="p-1 relative">
          <CardHeader className="p-1 text-primary">
            {notification.customer}
          </CardHeader>
          <p className="text-sm pl-2">
            {t('notification.payed', {
              referenceName: notification.referenceName,
              customer: notification.customer,
            })}
          </p>
          <div className="h-2 w-2 bg-secondary rounded-full absolute top-1/2 right-5"></div>
        </CardContent>
      </Card>
    </Link>
  );
};

const NotificationQuoteValidated = ({
  notification,
  className,
}: NotificationItemCardProps) => {
  const t = useTranslations();
  return (
    <Link href={`invoices`} className={className}>
      <Card className={'h-24'}>
        <CardContent className="p-1 relative">
          <CardHeader className="p-1 text-primary">
            {notification.customer}
          </CardHeader>
          <p className="text-sm pl-2">
            {t('notification.validated', {
              referenceName: notification.referenceName,
              customer: notification.customer,
            })}
          </p>
          <div className="h-2 w-2 bg-secondary rounded-full absolute top-1/2 right-5"></div>
        </CardContent>
      </Card>
    </Link>
  );
};

const NotificationQuoteRefused = ({
  notification,
  className,
}: NotificationItemCardProps) => {
  const t = useTranslations();
  return (
    <Link href={`invoices`} className={className}>
      <Card className={'h-24'}>
        <CardContent className="p-1 relative">
          <CardHeader className="p-1 text-primary">
            {notification.customer}
          </CardHeader>
          <p className="text-sm pl-2">
            {t('notification.validated', {
              referenceName: notification.referenceName,
              customer: notification.customer,
            })}
          </p>
          <div className="h-2 w-2 bg-secondary rounded-full absolute top-1/2 right-5"></div>
        </CardContent>
      </Card>
    </Link>
  );
};
