'use client'

import { Button } from '@components/ui/button'
import { Card, CardContent } from '@components/ui/card'
import { DateInput } from '@components/ui/date-input'
import { Form } from '@components/ui/form'
import { Input } from '@components/ui/input'
import { Select } from '@components/ui/select'
import { ExpenseFilterData } from '@repo/shared-types'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { fetchExpenseCategories } from '../../../lib/api/expense-categories'

type ExpenseFilterProps = {
  className?: string
  onChangeFilter: (filter: ExpenseFilterData | undefined) => void
}

export default function ExpenseFilter({
  className,
  onChangeFilter,
}: ExpenseFilterProps) {
  const t = useTranslations()
  const form = useForm<ExpenseFilterData>({
    defaultValues: {
      search: '',
      category: undefined,
    },
  })
  const startDate = form.watch('startDate')
  const endDate = form.watch('endDate')
  const amountMin = form.watch('amountMin')
  const amountMax = form.watch('amountMax')
  const { data } = useQuery({
    queryFn: () => fetchExpenseCategories(),
    queryKey: ['expense', 'category'],
  })

  const onSubmit = (filter: ExpenseFilterData) => {
    onChangeFilter(filter)
  }

  const resetForm = () => {
    onChangeFilter(undefined)
    form.reset()
  }

  const handleSubmitForm = () => {
    form.handleSubmit(onSubmit)
  }

  return (
    <Card className={clsx('pt-5 shadow-sm bg-slate-100/45', className)}>
      <CardContent className="">
        <form onSubmit={handleSubmitForm}>
          <Form {...form}>
            <h4 className="font-semibold">{t('common.filters')}</h4>
            <div className="flex flex-row w-full gap-10">
              <Input
                type="text"
                label={t('expense.search.label')}
                placeholder={t('expense.search.placeholder')}
                className="w-1/4"
                {...form.register('search')}
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
                {...form.register('category')}
              />
            </div>
            <div className="flex flex-row gap-10 w-full">
              <div className="flex flex-row items-center gap-5 mt-4">
                <DateInput
                  {...form.register('startDate')}
                  className="w-56"
                  placeholder={t('common.startDate')}
                  label={t('common.startDate')}
                  maxDate={endDate}
                />
                <span className="pt-5 text-sm">à</span>
                <DateInput
                  {...form.register('endDate')}
                  placeholder={t('common.endDate')}
                  className="w-56"
                  label={t('common.endDate')}
                  minDate={startDate}
                />
              </div>
              <div className="flex flex-row items-center gap-5 mt-4 w-auto">
                <Input
                  type="number"
                  {...form.register('amountMin')}
                  placeholder={t('common.startDate')}
                  label={t('expense.amountMin')}
                  max={amountMax}
                />
                <span className="pt-5 text-sm">à</span>
                <Input
                  type="number"
                  {...form.register('amountMax')}
                  placeholder={t('common.endDate')}
                  label={t('expense.amountMax')}
                  min={amountMin}
                />
              </div>
            </div>
          </Form>
          <div className="mt-2 flex flex-row justify-end gap-5">
            <Button variant={'outline'} type="button" onClick={resetForm}>
              {t('common.reinit')}
            </Button>
            <Button type="submit">{t('common.apply')}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
