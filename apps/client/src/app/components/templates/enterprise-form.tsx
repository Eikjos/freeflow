'use client';

import { Button } from '@components/ui/button';
import { Form } from '@components/ui/form';
import { Input } from '@components/ui/input';
import { Select } from '@components/ui/select';
import { Separator } from '@components/ui/separator';
import {
  EnterpriseCreateModel,
  EnterpriseInformation,
} from '@repo/shared-types';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useFormContext } from 'react-hook-form';
import { getAllCountriesQueryOptions } from '../../../lib/api/countries';
import { fetchEnterpriseInfo } from '../../../lib/api/enterprise';
import { getAllJuridicShapesQueryOptions } from '../../../lib/api/juridic-shapes';
import { Card, CardContent } from '../ui/card';

const EnterpriseForm = () => {
  const t = useTranslations();
  const form = useFormContext<EnterpriseCreateModel>();

  const updateFormValues = async (
    data: EnterpriseInformation,
    email: string,
    phone: string,
    prefixeInvoice?: string,
    lastInvoiceNumber?: number,
  ) => {
    form.reset({ ...data, email, phone, prefixeInvoice, lastInvoiceNumber });
    await form.trigger([
      'siret',
      'name',
      'address',
      'city',
      'tvaNumber',
      'zipCode',
      'juridicShape',
      'countryId',
    ]);
  };

  const { data: countries } = useQuery(getAllCountriesQueryOptions());
  const { data: juridicShapes } = useQuery(getAllJuridicShapesQueryOptions());

  const fillFormWithEnterpriseinfo = () => {
    void fetchEnterpriseInfo(form.getValues().siret.replace(/\s+/g, '')).then(
      async (res) => {
        if (res.data && res.ok) {
          await updateFormValues(
            res.data,
            form.getValues().email,
            form.getValues().phone,
            form.getValues().prefixeInvoice,
            form.getValues().lastInvoiceNumber,
          );
        }
      },
    );
  };

  return (
    <>
      <Card className="w-3/4 h-auto mx-auto">
        <CardContent className="py-5 px-8">
          <Form {...form}>
            <form>
              <div className="flex flex-row gap-2 items-stretch h-auto">
                <div className="w-1/3 px-2 py-3 flex flex-col items-center h-full">
                  <h4 className="text-xl font-bold w-full">
                    {t('common.informations')}
                  </h4>
                  <Input
                    type="text"
                    label={t('enterprise.siret')}
                    placeholder={t('enterprise.siret')}
                    className="mt-4"
                    description={t('enterprise.fillForm')}
                    {...form.register('siret')}
                  />
                  <Button
                    className="mt-2"
                    type="button"
                    onClick={fillFormWithEnterpriseinfo}
                  >
                    {t('common.fill')}
                  </Button>
                  <Input
                    type="text"
                    label={t('enterprise.name')}
                    placeholder={t('enterprise.name')}
                    className="mt-[1.8rem]"
                    {...form.register('name')}
                  />
                  <Select
                    label={t('enterprise.juridicShape')}
                    className="mt-3"
                    placeholder={t('enterprise.juridicShape')}
                    values={(juridicShapes?.data ?? []).map((item) => ({
                      value: item.code,
                      textValue: item.designation,
                    }))}
                    {...form.register('juridicShape')}
                  />
                  <Input
                    type="text"
                    label={t('enterprise.tvaNumber')}
                    placeholder={t('enterprise.tvaNumber')}
                    className="mt-3"
                    {...form.register('tvaNumber')}
                  />
                </div>
                <Separator
                  className="h-auto bg-secondary"
                  orientation="vertical"
                />
                <div className="w-1/3 px-2 py-3 flex flex-col items-center">
                  <h4 className="text-xl font-bold w-full">
                    {t('common.localisation')}
                  </h4>
                  <Input
                    type="text"
                    label={t('common.address')}
                    placeholder={t('common.address')}
                    className="mt-4"
                    {...form.register('address')}
                  />
                  <Input
                    type="text"
                    label={t('common.zipCode')}
                    placeholder={t('common.zipCode')}
                    className="mt-4"
                    {...form.register('zipCode')}
                  />
                  <Input
                    type="text"
                    label={t('common.city')}
                    placeholder={t('common.city')}
                    className="mt-4"
                    {...form.register('city')}
                  />
                  <Select
                    label={t('common.country')}
                    placeholder={t('common.country')}
                    values={(countries?.data ?? []).map((c) => ({
                      value: c.id.toString(),
                      textValue: t(c.name),
                    }))}
                    className="mt-3"
                    {...form.register('countryId')}
                  />
                </div>
                <Separator
                  className="h-auto bg-secondary"
                  orientation="vertical"
                />
                <div className="w-1/3 px-2 py-3 flex flex-col items-center">
                  <h4 className="text-xl font-bold w-full">
                    {t('common.contact')}
                  </h4>
                  <Input
                    type="text"
                    label={t('common.email')}
                    placeholder={t('common.email')}
                    className="mt-5"
                    {...form.register('email')}
                  />
                  <Input
                    type="text"
                    label={t('common.phone')}
                    placeholder={t('common.phone')}
                    className="mt-5"
                    {...form.register('phone')}
                  />
                </div>
              </div>
              <div>
                <div className="flex flex-row items-center gap-4 justify-center mt-4">
                  <Separator className="w-1/3 bg-secondary" />
                  <h2>{t('invoice.informationTitle')}</h2>
                  <Separator className="w-1/3 bg-secondary" />
                </div>
                <div className="flex flex-row items-center justify-center gap-10 mt-3">
                  <Input
                    type="text"
                    label={t('invoice.prefixe')}
                    {...form.register('prefixeInvoice')}
                    description="Pour utiliser votre préfixe de facture."
                  />
                  <Input
                    type="number"
                    min="0"
                    label={t('invoice.lastNumber')}
                    {...form.register('lastInvoiceNumber')}
                    description={t('invoice.numberDescription')}
                  />
                </div>
              </div>
              <ul>
                {Object.entries(form.formState.errors).map(
                  ([fieldName, error]) => (
                    <li key={fieldName}>
                      {fieldName} - {error?.message?.toString()}
                    </li>
                  ),
                )}
              </ul>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

export default EnterpriseForm;
