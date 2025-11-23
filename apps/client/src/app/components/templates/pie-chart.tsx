"use client";

import {
  Cell,
  Pie,
  PieChart as PieChartProvider,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { cn, formatPrice } from "../../../lib/utils";

type PieChartData = {
  name: string;
  value: number;
};

type PieChartProps = {
  data: PieChartData[];
  className: string;
  colors: string[];
  type?: "PRICE" | "DEFAULT";
};

export default function PieChart({
  data,
  className,
  colors,
  type = "DEFAULT",
}: PieChartProps) {
  return (
    <div className={cn(className)}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChartProvider>
          <Pie data={data} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => {
              if (type === "DEFAULT") return value;
              return formatPrice(value, "fr-FR", "EUR");
            }}
          />
        </PieChartProvider>
      </ResponsiveContainer>
    </div>
  );
}
