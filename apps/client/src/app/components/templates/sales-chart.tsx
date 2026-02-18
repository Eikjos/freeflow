import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@components/ui/chart';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';

type SalesChartProps<TConfig extends ChartConfig> = {
  className?: string;
  config: TConfig;
  data: ({
    label: string;
  } & {
    // chaque clé du config doit exister dans data
    [year: number]: number;
  })[];
  type: 'BAR' | 'CHART';
};

export const SalesChart = <TConfig extends ChartConfig>({
  config,
  data,
  type,
  className,
}: SalesChartProps<TConfig>) => {
  return (
    <>
      {type == 'CHART' && (
        <ChartContainer config={config} className={className}>
          <AreaChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={true}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={3}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            {Object.keys(config).map((e, index) => (
              <Area
                key={index}
                dataKey={e}
                type="monotone"
                fill={config[e]?.color}
                fillOpacity={0.4}
                stroke={config[e]?.color}
              />
            ))}
          </AreaChart>
        </ChartContainer>
      )}
      {type == 'BAR' && (
        <ChartContainer config={config} className={className}>
          <BarChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={true}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={3}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            {Object.keys(config).map((e, index) => (
              <Bar
                key={index}
                dataKey={e}
                type="monotone"
                fill={config[e]?.color}
                fillOpacity={0.4}
                stroke={config[e]?.color}
              />
            ))}
          </BarChart>
        </ChartContainer>
      )}
    </>
  );
};
