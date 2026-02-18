import { Button } from '@components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog';
import { Form } from '@components/ui/form';
import { Input } from '@components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { InvoiceLineData, InvoiceLineValidation } from '@repo/shared-types';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { formatPrice } from '../../../lib/utils';

export type CreateInvoiceLineModal = {
  open: boolean;
  handleOpen: (value: boolean) => void;
  handleSubmit: (value: InvoiceLineData) => void;
};

export default function CreateInvoiceLineModal({
  open,
  handleOpen,
  handleSubmit,
}: CreateInvoiceLineModal) {
  const t = useTranslations();
  const form = useForm<InvoiceLineData>({
    resolver: zodResolver(InvoiceLineValidation),
    defaultValues: {
      name: '',
      quantity: 1,
      unitPrice: 0.0,
    },
  });
  const quantity = form.watch('quantity');
  const unitPrice = form.watch('unitPrice');
  const userLocale = 'fr-FR';
  const currency = 'EUR';

  const onSubmit = (values: InvoiceLineData) => {
    handleSubmit(values);
    handleOpenModal(false);
  };

  const handleSubmitForm = () => {
    form.handleSubmit(onSubmit);
  };

  const handleOpenModal = (value: boolean) => {
    if (!value) form.reset();

    handleOpen(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl">
            {t('invoice.lines.add')}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form>
            <Input label={'Nom'} placeholder="Nom" {...form.register('name')} />
            <Input
              label={t('common.quantity')}
              placeholder={t('common.quantity')}
              type="number"
              {...form.register('quantity', { valueAsNumber: true })}
            />
            <Input
              label={'Prix HT'}
              placeholder="Prix HT"
              type="number"
              {...form.register('unitPrice', {
                valueAsNumber: true,
              })}
            />
            <p>
              {quantity} x {formatPrice(unitPrice, userLocale, currency)} ={' '}
              {formatPrice(quantity * unitPrice, userLocale, currency)}
            </p>
            <DialogFooter>
              <Button onClick={handleSubmitForm}>{t('common.create')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
