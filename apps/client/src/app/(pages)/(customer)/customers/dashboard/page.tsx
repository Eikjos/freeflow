import NotFoundEnterprise from '(pages)/(enterprise)/not-found';
import NotificationCard from '@components/templates/notifications-card';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@components/ui/card';
import { ChartNoAxesGantt, FileClock } from 'lucide-react';
import { headers } from 'next/headers';
import { formatPrice } from '../../../../../lib/utils';
import { CustomerInfo } from '../../../../../types/customer-info-type';
import { UserInfoType } from '../../../../../types/user-info-types';

export default async function CustomerDashboardPage() {
  const header = await headers();
  const headerUser = header.get('x-user');
  if (!headerUser) return <NotFoundEnterprise />;
  const headerCustomer = header.get('x-customer');
  if (!headerCustomer) return <NotFoundEnterprise />;
  const user = JSON.parse(headerUser) as UserInfoType;
  const customer = JSON.parse(headerCustomer) as CustomerInfo;

  return (
    <div>
      <h1 className="text-4xl font-amica">Bonjour {user.firstName}</h1>
      <div className="grid grid-cols-2 gap-5 mt-10">
        <Card>
          <CardContent>
            <CardHeader className="flex flex-row gap-5 items-center">
              <div className="w-10 h-10 rounded-lg bg-primary">
                <ChartNoAxesGantt
                  size={22}
                  color="white"
                  className="mx-auto mt-2"
                />
              </div>
              <span className="text-xl font-light pb-2">Projets</span>
            </CardHeader>
            <CardDescription className="flex flex-row justify-between items-center">
              <span className="text-3xl">5</span>
              <span className="text-primary text-xl">10 tickets assignés</span>
            </CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <CardHeader className="flex flex-row gap-5 items-center">
              <div className="w-10 h-10 rounded-lg bg-secondary">
                <FileClock size={22} color="white" className="mx-auto mt-2" />
              </div>
              <span className="text-xl font-light pb-2">
                Facture en attente
              </span>
            </CardHeader>
            <CardDescription className="flex flex-row justify-between items-center">
              <span className="text-3xl">5</span>
              <span className="text-primary text-xl">
                {formatPrice(1500, 'fr-FR', 'EUR')}
              </span>
            </CardDescription>
          </CardContent>
        </Card>
      </div>
      <NotificationCard customerId={customer.id} className="mt-5" />
    </div>
  );
}
