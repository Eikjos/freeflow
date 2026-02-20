'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LoginData, LoginDataValidation } from '@repo/shared-types';
import { login } from 'actions/login';
import { useTranslations } from 'next-intl';
import { RedirectType, redirect } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { cn } from '../../../lib/utils';
import { Button } from '../ui/button';
import { Form } from '../ui/form';
import { Input } from '../ui/input';
import { SecretInput } from '../ui/secret-input';

type LoginFormProps = {
  className?: string;
};

export const LoginForm = ({ className }: LoginFormProps) => {
  const [error, setError] = useState<string>();
  const t = useTranslations();
  const form = useForm<LoginData>({
    resolver: zodResolver(LoginDataValidation),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const onSubmit = async (values: LoginData) => {
    await login(values).then((data) => {
      if (!data.success) {
        setError(data.message);
        return;
      }
      if (data.data?.role == 'enterprise') {
        if (data.data.enterpriseId == null) {
          redirect('/enterprise/create', RedirectType.replace);
        } else {
          redirect('/dashboard', RedirectType.replace);
        }
      } else if (data.data?.role == 'customer') {
        redirect('/customers/dashboard');
      }
      redirect('/', RedirectType.replace);
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('px-10 flex flex-col items-center gap-7', className)}
      >
        {error && (
          <p className="text-sm text-destructive w-full text-center">
            {t(error)}
          </p>
        )}
        <Input
          {...form.register('email')}
          className="w-full"
          placeholder={t('common.email')}
          label={t('common.email')}
        />
        <SecretInput
          {...form.register('password')}
          placeholder={t('common.password')}
          label={t('common.password')}
        />
        <p className="text-sm">
          {t('login.noAccount')}{' '}
          <a href="/tarifs" className="text-secondary">
            {t('login.createAccount')}
          </a>
        </p>
        <Button type="submit" className="w-40">
          {t('login.login')}
        </Button>
      </form>
    </Form>
  );
};
