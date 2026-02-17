'use client'

import Loading from '@components/ui/loading'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import {
  CartesianGrid,
  DotProps,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getPrevisionsQueryOptions } from '../../../lib/api/sales'
import { cn, stringToDateYear } from '../../../lib/utils'

type PrevisionCAChartProps = {
  className?: string
}

export default function PrevisionCAChart({ className }: PrevisionCAChartProps) {
  const { data, isLoading } = useQuery(getPrevisionsQueryOptions())
  const t = useTranslations()

  if (isLoading) {
    return (
      <div className="w-full h-[300px] flex justify-center items-center">
        <Loading />
      </div>
    )
  }

  return (
    <div className={cn('h-[300px]', className)}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data?.data}
          margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tickFormatter={(v: string) => stringToDateYear(v)}
            tickLine={false}
            tick={false}
            tickMargin={8}
          />
          <YAxis tickFormatter={(v) => `${v / 1000}k €`} />
          <Tooltip
            content={({ active, payload, label }) => {
              const lab: string = label
              if (active && payload && payload.length) {
                const salePoint = payload.find((p) => p.dataKey === 'sale')
                const previsionPoint = payload.find(
                  (p) => p.dataKey === 'prevision',
                )

                return (
                  <div
                    style={{
                      background: 'white',
                      border: '1px solid #ccc',
                      padding: 8,
                    }}
                  >
                    <strong>{stringToDateYear(lab)}</strong>
                    {salePoint && (
                      <div>
                        {salePoint.name}: {salePoint.value?.toLocaleString()} €
                      </div>
                    )}
                    {previsionPoint &&
                      salePoint?.value != previsionPoint.value && (
                        <div>
                          {previsionPoint.name}:{' '}
                          {previsionPoint.value?.toLocaleString()} €
                        </div>
                      )}
                  </div>
                )
              }
              return null
            }}
          />
          <Legend />

          {/* Ligne CA réel */}
          {/* Ligne Prévision (pointillée) */}
          <Line
            key={'previsions'}
            type="monotone"
            dataKey="prevision"
            stroke="#00C49F"
            strokeWidth={3}
            strokeDasharray="6 4"
            name={t('sales.prevision')}
            dot={(
              props: DotProps & {
                payload: { sale: number; prevision: number }
              },
            ) => {
              const { cx, cy, payload } = props
              // n’affiche le dot que si c’est un point de prévision
              if (
                payload &&
                payload.prevision !== payload.sale &&
                payload.prevision
              ) {
                return (
                  <circle
                    key={Math.random()}
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill="#00C49F"
                    stroke="#00C49F"
                  />
                )
              }
              return <g key={Math.random()} /> // sinon aucun point
            }}
            activeDot={false}
            connectNulls={false}
          />
          <Line
            key={'sales'}
            type="monotone"
            dataKey="sale"
            stroke="#0011AA"
            strokeWidth={3}
            dot={{ r: 5, fill: '#0011AA' }}
            name={t('sales.real')}
            connectNulls={false}
            activeDot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
