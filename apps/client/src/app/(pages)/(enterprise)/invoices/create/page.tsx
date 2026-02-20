'use client';

import NotFoundEnterprise from '(pages)/(enterprise)/not-found';
import Autocomplete from '@components/molecules/autocomplete';
import CreateInvoiceLineModal from '@components/organisms/create-invoice-line-dialog';
import InvoiceLineList from '@components/organisms/invoice-line-list';
import { Button } from '@components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Checkbox } from '@components/ui/checkbox';
import { DateInput } from '@components/ui/date-input';
import { Form } from '@components/ui/form';
import { Input } from '@components/ui/input';
import Loading from '@components/ui/loading';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckedState } from '@radix-ui/react-checkbox';
import { PDFViewer, pdf } from '@react-pdf/renderer';
import { InvoiceTemplate } from '@repo/pdf-templates';
import {
  InvoiceCreateData,
  InvoiceCreateValidation,
  InvoiceLineCreateData,
} from '@repo/shared-types';
import { useQuery } from '@tanstack/react-query';
import { createInvoice } from 'actions/invoice';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEnterprise } from 'providers/enterprise-provider';
import { ChangeEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  getAllCustomersQueryOptions,
  getCustomerByIdOptions,
} from '../../../../../lib/api/customers';
import { getInformationForInvoiceQueryOptions } from '../../../../../lib/api/enterprise';
import { getInvoiceByIdQueryOptions } from '../../../../../lib/api/invoices';
import {
  getAllTasksQueryOptions,
  getTasksById,
} from '../../../../../lib/api/tasks';
import getQueryClient from '../../../../../lib/query-client';

export default function CreateInvoicesPage() {
  const queryClient = getQueryClient();
  const t = useTranslations();
  const searchParams = useSearchParams();
  const devisId = searchParams.get('devisId');
  const { enterprise } = useEnterprise();
  if (!enterprise) {
    return <NotFoundEnterprise />;
  }
  const router = useRouter();
  const [maskNameOnInvoice, setMaskNameOnInvoice] = useState<boolean>(true);
  const [modalTaskOpen, setModalTaskOpen] = useState<boolean>(false);
  const { data: DevisData, isLoading: isLoadingDevis } = useQuery({
    ...getInvoiceByIdQueryOptions(parseInt(devisId ?? '')),
    enabled:
      devisId !== undefined && !isNaN(Number(devisId)) && devisId !== null,
  });
  const { data, isSuccess, isLoading } = useQuery({
    ...getInformationForInvoiceQueryOptions(enterprise.id),
    enabled: !!enterprise,
  });
  const form = useForm<InvoiceCreateData>({
    resolver: zodResolver(InvoiceCreateValidation),
    defaultValues: {
      title: '',
      number: '1',
      type: 'INVOICE',
      customerId: undefined,
      date: new Date(),
      invoiceLines: [],
      excludeTva: false,
    },
  });
  const customerId = form.watch('customerId');
  const invoiceLines = form.watch('invoiceLines');
  const title = form.watch('title');
  const number = form.watch('number');
  const date = form.watch('date');
  const excludeTva = form.watch('excludeTva');
  const customer = useQuery({
    ...getCustomerByIdOptions(customerId ? customerId.toString() : ''),
    enabled: customerId !== undefined,
  });

  useEffect(() => {
    if (data?.data?.lastNumber !== undefined && isSuccess) {
      form.setValue('number', (data.data.lastNumber ?? 1).toString());
    }
  }, [data?.data]);

  useEffect(() => {
    if (DevisData?.ok && DevisData.data) {
      form.setValue('customerId', DevisData.data.customer.id);
      form.setValue(
        'invoiceLines',
        DevisData.data.invoiceLines.map(
          (e) =>
            ({
              name: e.name,
              quantity: e.quantity,
              unitPrice: e.unitPrice,
            }) as InvoiceLineCreateData,
        ),
      );
      form.setValue('title', DevisData.data.title);
      form.setValue('excludeTva', DevisData.data.excludeTva);
    }
  }, [DevisData?.data]);

  const appendInvoiceLine = (value: InvoiceLineCreateData) => {
    const invoiceLinesOld = invoiceLines;
    form.setValue('invoiceLines', [...invoiceLinesOld, value]);
  };

  const handleChangeInvoiceLine = (values: InvoiceLineCreateData[]) => {
    form.setValue('invoiceLines', values);
  };

  const handleChangeTask = async (value: number | undefined) => {
    if (value !== undefined) {
      const invoiceLine = await getTasksById(value);
      const invoiceLinesOld = invoiceLines;
      if (
        invoiceLine.ok &&
        !invoiceLinesOld.some((e) => e.name === invoiceLine.data?.name) &&
        invoiceLine.data
      ) {
        form.setValue('invoiceLines', [
          ...invoiceLinesOld,
          { name: invoiceLine.data.name, quantity: 1, unitPrice: 0.0 },
        ]);
      }
    }
  };

  const handleChangeCustomer = (event: ChangeEvent<HTMLInputElement>) => {
    void handleChangeTask(parseInt(event.target.value));
  };

  const handleMashNameChange = (checked: CheckedState) => {
    setMaskNameOnInvoice(checked ? true : false);
  };

  const handleExcludeTvaChange = (checked: CheckedState) => {
    form.setValue('excludeTva', checked ? true : false);
  };

  const onSubmit = async (values: InvoiceCreateData) => {
    const invoiceBlob = await pdf(
      <InvoiceTemplate
        title={values.title}
        number={values.number}
        date={values.date}
        customer={customer.data?.data}
        information={data?.data}
        maskName={maskNameOnInvoice}
        excludeTva={values.excludeTva}
        lines={values.invoiceLines}
        devisNumber={DevisData?.data?.number}
        devisDate={DevisData?.data?.date}
        apiUrl={process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? ''}
      />,
    ).toBlob();

    createInvoice(
      {
        ...values,
        type: 'INVOICE',
        excludeTva: values.excludeTva ?? false,
        number: `${data?.data?.prefixe}-${String(values.number).padStart(5, '0')}`,
        devisId:
          devisId !== null && !isNaN(Number(devisId)) && devisId !== null
            ? parseInt(devisId)
            : undefined,
      },
      new File(
        [invoiceBlob],
        `invoice-${data?.data?.prefixe}-${values.number}.pdf`,
      ),
    )
      .then((res) => {
        if (res === null) {
          toast.error('Il y a eu une erreur.');
        } else {
          toast.success(t('invoice.success.create'));
          void queryClient.invalidateQueries({ queryKey: ['sales'] });
          router.push('/invoices');
        }
      })
      .catch((err: Error) => {
        toast.error(err.message);
      });
  };

  if (isLoading || isLoadingDevis) {
    return (
      <div className="w-full h-full flex-row flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="h-full">
      <Card className="mb-10">
        <CardHeader>
          <CardTitle>{t('invoice.create')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-rox justify-end gap-4">
            <Checkbox
              label={t('invoice.maskName')}
              checked={maskNameOnInvoice}
              onCheckedChange={handleMashNameChange}
            />
            {data?.data?.enterprise.juridicShape ===
              'Entrepreneur individuel' && (
              <Checkbox
                label={'invoice.notIncludeTva'}
                checked={excludeTva}
                onCheckedChange={handleExcludeTvaChange}
              />
            )}
          </div>
          <Form {...form}>
            <form>
              <Input
                label={t('common.title')}
                placeholder={t('invoice.title')}
                {...form.register('title')}
              />
              <Input
                label={t('common.number')}
                type="number"
                placeholder={t('invoice.number')}
                {...form.register('number')}
              />
              <DateInput
                label={t('common.number')}
                {...form.register('date')}
              />
              <Autocomplete
                label={t('common.customer')}
                placeholder={devisId !== null ? '' : t('customer.select')}
                queryOptions={(filter) =>
                  getAllCustomersQueryOptions({
                    page: 0,
                    pageSize: 20,
                    asc: 'name',
                    filter: {
                      name: filter.search,
                      id: filter.id,
                    },
                  })
                }
                render={(item) => item.name}
                filterField="name"
                fieldIdentifier="id"
                disabled={devisId !== null}
                {...form.register('customerId')}
              />
              <Autocomplete
                queryOptions={(filter) =>
                  getAllTasksQueryOptions({
                    page: 0,
                    pageSize: 20,
                    asc: 'name',
                    filter: {
                      name: filter.search,
                      id: filter.id,
                      customerId: customerId,
                    },
                  })
                }
                disabled={!customerId}
                filterField="name"
                render={(task) => `${task.name}`}
                fieldIdentifier="id"
                label={t('task.name')}
                className="mt-3"
                placeholder={t('task.select')}
                onAdd={() => setModalTaskOpen(true)}
                addLabel={t('task.add')}
                {...form.register('invoiceLine', {
                  value: undefined,
                  onChange: handleChangeCustomer,
                })}
              />
            </form>
          </Form>
          {invoiceLines.length > 0 && (
            <div className="mt-4">
              <p>{t('invoice.lines.title')}</p>
              <InvoiceLineList
                invoices={invoiceLines}
                handleChange={handleChangeInvoiceLine}
                canDelete={devisId === null}
              />
            </div>
          )}
          <div className="flex flex-row justify-end mt-4">
            <Button onClick={form.handleSubmit(onSubmit)}>
              {t('common.submitAndSend')}
            </Button>
          </div>
        </CardContent>
      </Card>
      <CreateInvoiceLineModal
        open={modalTaskOpen}
        handleOpen={(value) => setModalTaskOpen(value)}
        handleSubmit={(value) => appendInvoiceLine(value)}
      />
      <PDFViewer className="w-full h-5/6 rounded-md" showToolbar={false}>
        <InvoiceTemplate
          title={title}
          number={number}
          date={date}
          customer={customer?.data?.data}
          information={data?.data}
          maskName={maskNameOnInvoice}
          excludeTva={excludeTva}
          lines={invoiceLines}
          apiUrl={process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? ''}
        />
      </PDFViewer>
    </div>
  );
}
