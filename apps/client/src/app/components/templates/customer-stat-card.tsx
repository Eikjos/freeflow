"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import Loading from "@components/ui/loading";
import { Tabs, TabsList, TabsTrigger } from "@components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getStatsQueryOptions } from "../../../lib/api/customers";
import CustomerChart from "./customer-chart";

type CustomerStatProps = {
  className?: string;
};

export default function CustomerStatCard({ className }: CustomerStatProps) {
  const [month, setMonth] = useState(6);
  const { data, isLoading } = useQuery(getStatsQueryOptions(month));

  return (
    <Card className={className}>
      <CardContent className="py-4 px-4">
        <CardHeader className="flex flex-row w-full justify-between items-center">
          <CardTitle>Evolution des clients</CardTitle>
          <Tabs defaultValue="6">
            <TabsList>
              <TabsTrigger onClick={() => setMonth(3)} value="3">
                3m
              </TabsTrigger>
              <TabsTrigger onClick={() => setMonth(6)} value="6">
                6m
              </TabsTrigger>
              <TabsTrigger onClick={() => setMonth(12)} value="12">
                12m
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        {isLoading ? (
          <div className="w-full h-[300px] flex flex-row justify-center items-center">
            <Loading />
          </div>
        ) : (
          <CustomerChart data={data?.data ?? []} className="h-[300px] w-full" />
        )}
      </CardContent>
    </Card>
  );
}
