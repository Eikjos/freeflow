import { Card, CardContent } from '@components/ui/card'
import { Input } from '@components/ui/input'
import { EditEnterpriseData } from '@repo/shared-types'
import { useTranslations } from 'next-intl'
import { useFormContext } from 'react-hook-form'

type InvoiceInfoFormProps = {
  className?: string
}

export default function InvoiceInfoForm({ className }: InvoiceInfoFormProps) {
  const form = useFormContext<EditEnterpriseData>()
  const t = useTranslations()
  return (
    <Card className={className}>
      <CardContent className="p-5">
        <h3 className="font-semibold">{t('invoice.informationTitle')}</h3>
        <div className="flex flex-row gap-4">
          <Input
            label={t('invoice.prefixe')}
            className="w-2/3"
            {...form.register('invoicePrefixe')}
          />
          <Input
            label={t('invoice.lastNumber')}
            type="number"
            className="w-1/3"
            {...form.register('invoiceNumber')}
            description={t('invoice.numberDescription')}
          />
        </div>
      </CardContent>
    </Card>
  )
}
