'use client';

import { Button } from '@components/ui/button';
import { Card, CardContent, CardHeader } from '@components/ui/card';
import { Form } from '@components/ui/form';
import { Input } from '@components/ui/input';
import { SecretInput } from '@components/ui/secret-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateUserData, CreateUserDataValidation } from '@repo/shared-types';
import { createUser } from 'actions/users';
import { CircleCheckBig } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { cn } from '../../../lib/utils';

type EnterpriseInscriptionFormProps = {
  className?: string;
};

export default function EnterpriseInscriptionForm({
  className,
}: EnterpriseInscriptionFormProps) {
  const t = useTranslations();
  const [isOk, setIsOk] = useState(false);
  const form = useForm<CreateUserData & { confirmPassword: string }>({
    resolver: zodResolver(CreateUserDataValidation),
    defaultValues: {
      firstName: '',
      lastName: '',
      password: '',
      email: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: CreateUserData) => {
    await createUser(values, true).then((res) => {
      if (res.success) {
        setIsOk(true);
      } else {
        toast.error(res.message);
      }
    });
  };

  if (isOk) {
    return (
      <Card className={cn(className)}>
        <CardContent className="p-4">
          <CircleCheckBig color="green" size={50} className="mx-auto mt-10" />
          <p className="text-center my-5 text-muted-foreground">
            {t('inscription.success.title')}
            <br />
            {t('inscription.success.subtitle')}
          </p>
          <div className="text-center mb-10">
            <Button asChild className="inline-block">
              <Link href="/enterprises/create">
                {t('inscription.createEnterprise')}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className={cn(className)}>
      <CardContent>
        <CardHeader className="pl-0 text-xl font-semibold">
          {t('inscription.form.title')}
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Form {...form}>
            <Input
              type="text"
              label={t('inscription.form.label.firstName')}
              {...form.register('firstName')}
              placeholder={t('inscription.form.label.firstName')}
            />
            <Input
              type="text"
              label={t('inscription.form.label.lastName')}
              {...form.register('lastName')}
              placeholder={t('inscription.form.label.lastName')}
            />
            <Input
              type="email"
              label={t('common.email')}
              {...form.register('email')}
              placeholder={t('common.email')}
            />
            <SecretInput
              label={t('common.password')}
              {...form.register('password')}
              placeholder={t('common.password')}
            />
            <SecretInput
              label={t('common.confirmPassword')}
              {...form.register('confirmPassword')}
              placeholder={t('common.confirmPassword')}
            />
            <div className="text-center">
              <Button type="submit" className="mt-5 mb-2 inline-block">
                {t('inscription.createAccount')}
              </Button>
            </div>
          </Form>
        </form>
      </CardContent>
    </Card>
  );
}
