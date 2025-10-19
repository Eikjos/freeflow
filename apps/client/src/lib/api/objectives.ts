import {
  ObjectiveData,
  PaginationFilter,
  PaginationResult,
} from "@repo/shared-types";
import { queryOptions } from "@tanstack/react-query";
import { client } from "../client";
import { generateQueryString } from "../utils";

export const getAllObjective = async (filter: PaginationFilter<any>) => {
  const query = generateQueryString(filter);
  return await client<PaginationResult<ObjectiveData>>(`objectives?${query}`);
};

export const getAllObjectiveQueryOptions = (filter: PaginationFilter<any>) =>
  queryOptions({
    queryFn: () => getAllObjective(filter),
    queryKey: ["objectives", filter],
    retry: false,
  });
