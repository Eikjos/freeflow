import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@components/ui/chart";
import { CustomerStatData } from "@repo/shared-types";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { numberToMonth } from "../../../lib/utils";

type CustomerChartProps = {
  data: CustomerStatData[];
  className?: string;
};

const config = {
  customers: {
    color: "red",
    label: "Nombre de client",
  },
} as ChartConfig;

function stringToDateYear(date: string) {
  const regex = /(\d+)-(\d+)/;
  const match = date.match(regex);
  if (match) {
    const year = match[1];
    const month = parseInt(match[2]!) - 1;
    return numberToMonth(month) + " " + year;
  }
  return date;
}

export default function CustomerChart({ data, className }: CustomerChartProps) {
  return (
    <ChartContainer config={config} className={className}>
      <AreaChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={true}
          tickMargin={8}
          tickFormatter={(value) => stringToDateYear(value)}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} tickCount={3} />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => stringToDateYear(value)}
            />
          }
        />
        <Area
          dataKey={"customers"}
          type="monotone"
          fill={"#fea052"}
          fillOpacity={0.4}
          stroke={"#fea052"}
        />
      </AreaChart>
    </ChartContainer>
  );
}
