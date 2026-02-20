'use client';

import { Button } from '@components/ui/button';
import { Form } from '@components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  EditEnterpriseData,
  EnterpriseData,
  EnterpriseEditValidation,
} from '@repo/shared-types';
import { updateEnterprise } from 'actions/enterprise';
import { useTranslations } from 'next-intl';
import { useEnterprise } from 'providers/enterprise-provider';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import InvoiceInfoForm from './invoice-info-form';
import MyEnterpriseForm from './my-enterprise-form';

type EnterpriseSettingFormProps = {
  enterprise: EnterpriseData;
};

export default function EnterpriseSettingsForm({
  enterprise,
}: EnterpriseSettingFormProps) {
  const t = useTranslations();
  const { setEnterprise, enterprise: enterpriseContext } = useEnterprise();
  const form = useForm<EditEnterpriseData>({
    resolver: zodResolver(EnterpriseEditValidation),
    defaultValues: {
      name: enterprise.name,
      tvaNumber: enterprise.tvaNumber ?? '',
      juridicShapeId: enterprise.juridicShapeId,
      countryId: enterprise.countryId.toString(),
      city: enterprise.city,
      zipCode: enterprise.zipCode,
      address: enterprise.address,
      email: enterprise.email,
      phone: enterprise.phone,
      invoiceNumber: enterprise.invoiceNumber,
      invoicePrefixe: enterprise.invoicePrefixe,
    },
  });

  const onSubmit = () => {
    updateEnterprise(enterprise.id, form.getValues(), form.getValues().logo)
      .then((res) => {
        setEnterprise({
          name: res.enterpriseName ?? '',
          sales: enterpriseContext?.sales ?? 0,
          id: enterprise.id,
        });
        toast.success(t('enterprise.success.update'));
      })
      .catch((e: Error) => toast.error(e.message));
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Form {...form}>
        <FormProvider {...form}>
          <MyEnterpriseForm className="mt-2" enterprise={enterprise} />
          <InvoiceInfoForm className="mt-2" />
        </FormProvider>
      </Form>
      <Button type="submit" className="float-right mt-5 mb-5">
        {t('common.save')}
      </Button>
    </form>
  );
}
