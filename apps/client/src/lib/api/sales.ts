import { SaleData } from "@repo/shared-types";
import { queryOptions } from "@tanstack/react-query";
import { client } from "../client";

export const getSalesByYear = (year: number) =>
  client<SaleData[]>(`sales?year=${year}`, { method: "GET" });

export const getSalesByYearQueryOptions = (year: number) =>
  queryOptions({
    queryFn: () => getSalesByYear(year),
    queryKey: ["sales", "year", year],
  });
