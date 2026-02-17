import { ObjectiveData } from '@repo/shared-types'
import dayjs from 'dayjs'
import { useTranslations } from 'next-intl'
import PieChart from './pie-chart'

type ObjectiveChartProps = {
  objective: ObjectiveData
}

export default function ObjectiveChart({ objective }: ObjectiveChartProps) {
  const t = useTranslations()

  return (
    <div>
      <div className="flex flex-row justify-between items-baseline">
        <span className="text-black">
          {objective.objectiveCategory == 'SALES'
            ? t('common.sales')
            : t('common.customer')}
        </span>
        <span className="text-sm text-gray-500">
          {dayjs(objective.startDate).format('DD/MM/YYYY')} -{' '}
          {dayjs(objective.endDate).format('DD/MM/YYYY')}
        </span>
      </div>
      <PieChart
        data={[
          {
            name:
              objective.objectiveCategory == 'SALES'
                ? t('common.sales')
                : t('common.customer'),
            value: objective.currentNumber,
          },
          {
            name: t('common.remaining'),
            value: objective.objectiveNumber - objective.currentNumber,
          },
        ]}
        colors={['#3e6450', '#fea052']}
        className="h-[300px]"
        type={objective.objectiveCategory === 'SALES' ? 'PRICE' : 'DEFAULT'}
      />
    </div>
  )
}
