"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { ChartConfig } from "@components/ui/chart";
import Loading from "@components/ui/loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { useQueries } from "@tanstack/react-query";
import { ChartAreaIcon, ChartBarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getSalesByYearQueryOptions } from "../../../lib/api/sales";
import { numberToMonth } from "../../../lib/utils";
import { SalesChart } from "./sales-chart";

type YearData = {
  [year: number]: number;
  label: string;
};

type SalesCardProps = {
  title: string;
  className?: string;
  yearInscription?: number;
  year?: number;
};

export default function SalesCard({
  title,
  className,
  yearInscription,
  year,
}: SalesCardProps) {
  const currentYear = new Date().getFullYear();
  const [chartData, setChartData] = useState<YearData[]>([]);
  let years: number[] = [];

  if (yearInscription) {
    years = Array.from({ length: 3 }, (_, i) => currentYear - i).filter(
      (year) => year >= yearInscription
    );
  } else if (year) {
    years = [year];
  }

  const results = useQueries({
    queries: years.map((year) => getSalesByYearQueryOptions(year)),
  });
  const [dataCurrent, dataLast, dataTwoYearsAgo] = results.map((r) => r.data);
  const isLoading = results.some((r) => r.isLoading);

  useEffect(() => {
    if (!isLoading) {
      let dataChart: YearData[] = [];
      for (let i = 0; i < 12; ++i) {
        const values = [
          dataCurrent?.data?.find((e) => e.month == i)?.amount ?? 0,
          dataLast?.data?.find((e) => e.month == i)?.amount ?? 0,
          dataTwoYearsAgo?.data?.find((e) => e.month == i)?.amount ?? 0,
        ];

        const obj = Object.fromEntries(
          years.map((year, idx) => [year, values[idx]])
        );

        dataChart = [
          ...dataChart,
          {
            label: numberToMonth(i),
            ...obj,
          },
        ];
      }
      setChartData(dataChart);
    }
  }, [isLoading]);

  const colors = ["green", "red", "blue"];

  const chartConfig = Object.fromEntries(
    years.map((year, idx) => [year, { label: year, color: colors[idx] }])
  ) satisfies ChartConfig;

  return (
    <Card className={className}>
      <Tabs defaultValue="chart">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>{title}</CardTitle>
          <TabsList className="py-0">
            <TabsTrigger value="chart">
              <ChartAreaIcon size={20} />
            </TabsTrigger>
            <TabsTrigger value="bar">
              <ChartBarIcon
                size={20}
                style={{ transform: "rotateX(-180deg) rotateZ(90deg)" }}
              />
            </TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          <TabsContent value="chart" className="max-h-[350px]">
            {isLoading && (
              <div className="h-[300px] flex flex-row justify-center items-center">
                <Loading />
              </div>
            )}
            {!isLoading && (
              <SalesChart
                data={chartData}
                config={chartConfig}
                type="CHART"
                className="max-h-[300px]  w-full"
              />
            )}
          </TabsContent>
          <TabsContent value="bar" className="max-h-[350px]">
            {isLoading && (
              <div className="h-[300px] flex flex-row justify-center items-center">
                <Loading />
              </div>
            )}
            {!isLoading && (
              <SalesChart
                data={chartData}
                config={chartConfig}
                type="BAR"
                className="max-h-[300px]  w-full"
              />
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
