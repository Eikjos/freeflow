'use client'

import { Button } from '@components/ui/button'
import { Card, CardContent, CardFooter } from '@components/ui/card'
import { DateInput } from '@components/ui/date-input'
import { Form } from '@components/ui/form'
import { Input } from '@components/ui/input'
import InputFile from '@components/ui/input-file'
import Loading from '@components/ui/loading'
import { Select } from '@components/ui/select'
import { Textarea } from '@components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CreateExpenseData,
  CreateExpenseDataValidation,
} from '@repo/shared-types'
import { useQuery } from '@tanstack/react-query'
import { createExpense } from 'actions/expense'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { fetchExpenseCategories } from '../../../lib/api/expense-categories'
import { formatPrice } from '../../../lib/utils'

type ExpenseFormProps = {
  className?: string
}

export default function ExpenseForm({ className }: ExpenseFormProps) {
  const t = useTranslations()
  const router = useRouter()
  const form = useForm<CreateExpenseData>({
    resolver: zodResolver(CreateExpenseDataValidation),
    defaultValues: {
      name: '',
      description: '',
      amount: 0.0,
      date: new Date(),
      categoryId: undefined,
    },
  })
  const amount = form.watch('amount')
  const categoryId = form.watch('categoryId')
  const expenseFile = form.watch('expense')
  const { data, isLoading } = useQuery({
    queryFn: () => fetchExpenseCategories(),
    queryKey: ['expense', 'category'],
  })

  const onChangeInput = (files: File[]) => {
    const file = files[files.length - 1]
    if (file) {
      form.setValue('expense', file, { shouldValidate: true })
    } else {
      form.setValue('expense', undefined, { shouldValidate: false })
    }
  }

  const onSubmit = (values: CreateExpenseData) => {
    createExpense(values)
      .then(() => {
        toast.success(t('expence.success.create'))
        router.push('/expenses')
      })
      .catch((e: Error) => {
        toast.error(e.message)
      })
  }

  const calculateTvaRecoverablePrice = (categoryId: number) => {
    const category = data?.data?.filter((d) => d.id == categoryId)[0]
    if (category) {
      const amountTva = amount * (0 + category.tva / 100)
      return amountTva * (category.recoverablePercent / 100)
    }
    return 0
  }

  const handleSubmit = () => {
    form.handleSubmit(onSubmit)
  }

  if (isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loading />
      </div>
    )

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <Card className={className}>
          <CardContent className="px-8 py-6">
            <Input
              label={t('common.name')}
              placeholder={t('common.name')}
              {...form.register('name')}
            />
            <DateInput
              label={t('common.date')}
              placeholder={t('common.date')}
              {...form.register('date')}
            />
            <Input
              type="number"
              step={0.01}
              min={0.0}
              label={t('common.amount')}
              placeholder={t('common.amount')}
              {...form.register('amount')}
            />
            <Select
              label={t('common.category')}
              placeholder={t('common.category')}
              values={
                data?.data?.map((e) => ({
                  value: e.id.toString(),
                  textValue: e.key ? t(e.key) : e.name,
                })) ?? []
              }
              {...form.register('categoryId')}
            />

            {amount && categoryId ? (
              <p className="mt-1 text-sm">
                {t('expense.recapTVA', {
                  recoverable: formatPrice(
                    calculateTvaRecoverablePrice(categoryId),
                    'fr-FR',
                    'EUR',
                  ),
                  cost: formatPrice(
                    amount - calculateTvaRecoverablePrice(categoryId),
                    'fr-FR',
                    'EUR',
                  ),
                })}
              </p>
            ) : null}

            <Textarea
              label={t('common.description')}
              placeholder={t('common.description')}
              {...form.register('description')}
            />

            <InputFile
              onFilesSelected={onChangeInput}
              multiple={false}
              className="mt-5"
              accept=".png, .jpeg, .jpg, .pdf"
            />

            {expenseFile && (
              <img
                src={URL.createObjectURL(expenseFile)}
                className="mx-auto w-1/2 mt-5"
              />
            )}

            <CardFooter className="flex flex-row justify-end px-0 mt-5">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {t('common.save')}
              </Button>
            </CardFooter>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
