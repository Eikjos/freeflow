'use client';

import Logo from '@components/molecules/logo';
import { Button } from '@components/ui/button';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

type HeaderProps = {
  displayMenu: boolean;
  hideLogin?: boolean;
  isLogged?: boolean;
  isCustomer?: boolean;
};

export default function Header({
  displayMenu = false,
  hideLogin = false,
  isLogged,
  isCustomer,
}: HeaderProps) {
  const t = useTranslations();
  return (
    <div className="pl-3 bg-card container rounded-full border border-secondary mt-10 mx-auto flex flew-row justify-between sticky">
      <div className="w-52">
        <Logo />
      </div>
      <div className="flex flex-row items-center pr-10 gap-10">
        {displayMenu && (
          <ul className="flex flex-row items-center gap-4">
            <li>
              <Link href={'/#features'}>{t('common.features')}</Link>
            </li>
            <li>
              <Link href={'/#tarifs'}>{t('common.tarifs')}</Link>
            </li>
          </ul>
        )}
        {/* Gérer le cas de la connexion */}
        {!hideLogin && (
          <Button className="rounded-full" asChild>
            {isLogged ? (
              <Link href={isCustomer ? '/customers/dashboard' : '/dashboard'}>
                {t('common.accessDashboard')}
              </Link>
            ) : (
              <Link href="/login">{t('login.login')}</Link>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
