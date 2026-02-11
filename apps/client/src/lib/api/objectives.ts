import {
  ObjectiveData,
  PaginationFilter,
  PaginationResult,
} from "@repo/shared-types";
import { queryOptions } from "@tanstack/react-query";
import { client } from "../client";
import { generateQueryString } from "../utils";

export const getAllObjective = async (filter: PaginationFilter<never>) => {
  const query = generateQueryString(filter);
  return await client<PaginationResult<ObjectiveData>>(`objectives?${query}`);
};

export const getAllObjectiveQueryOptions = (filter: PaginationFilter<never>) =>
  queryOptions({
    queryFn: () => getAllObjective(filter),
    queryKey: ["objectives", filter],
    retry: false,
  });

export const getInProgressObjective = async () =>
  await client<ObjectiveData[]>("objectives/in-progress");

export const getInProgressObjectiveQueryOptions = () =>
  queryOptions({
    queryFn: getInProgressObjective,
    queryKey: ["objectives", "in-progress"],
    retry: false,
  });
