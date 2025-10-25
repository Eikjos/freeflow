import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

type SalesChartProps<TConfig extends ChartConfig> = {
  className?: string;
  config: TConfig;
  data: ({
    label: string;
  } & {
    // chaque clé du config doit exister dans data
    [K in keyof TConfig]: number;
  })[];
  type: "BAR" | "CHART";
};

export const SalesChart = <TConfig extends ChartConfig>({
  config,
  data,
  type,
  className,
}: SalesChartProps<TConfig>) => {
  return (
    <>
      <ChartContainer config={config} className={className}>
        <AreaChart accessibilityLayer data={data}>
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
              type="natural"
              fill={config[e]?.color}
              fillOpacity={0.4}
              stroke={config[e]?.color}
            />
          ))}
        </AreaChart>
      </ChartContainer>
    </>
  );
};
