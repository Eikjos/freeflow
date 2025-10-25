"use client";

import { SalesChart } from "@components/templates/sales-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { ChartConfig } from "@components/ui/chart";
const chartData = [
  { label: "January", [2025]: 186, [2024]: 80, [2023]: 120 },
  { label: "February", [2025]: 305, [2024]: 200, [2023]: 250 },
  { label: "March", [2025]: 237, [2024]: 120, [2023]: 212 },
  { label: "April", [2025]: 73, [2024]: 190, [2023]: 123 },
  { label: "May", [2025]: 209, [2024]: 130, [2023]: 12 },
  { label: "June", [2025]: 214, [2024]: 140, [2023]: 100 },
];

export default function StatsPage() {
  const currentYear = new Date().getFullYear();

  const chartConfig = {
    [currentYear]: {
      label: currentYear,
      color: "green",
    },
    [currentYear - 1]: {
      label: currentYear - 1,
      color: "red",
    },
    [currentYear - 2]: {
      label: currentYear - 2,
      color: "blue",
    },
  } satisfies ChartConfig;

  return (
    <>
      <h1 className="font-amica text-4xl">Mes chiffres</h1>
      <Card>
        <CardHeader>
          <CardTitle>Le chiffre d'affaire</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesChart
            data={chartData}
            config={chartConfig}
            type="CHART"
            className="max-h-[300px]  w-full"
          />
        </CardContent>
      </Card>
    </>
  );
}
