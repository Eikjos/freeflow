import {
  PaginationFilter,
  PaginationResult,
  TaskData,
  TaskFilter,
} from "@repo/shared-types";
import { UseQueryOptions } from "@tanstack/react-query";
import { HttpResponse } from "../../types/http-response";
import { client } from "../client";
import { generateQueryString } from "../utils";

export const getAllTasks = async (pagination: PaginationFilter<TaskFilter>) => {
  const query = generateQueryString(pagination);
  return await client<PaginationResult<TaskData>>(`tasks?${query}`);
};

export const getAllTasksQueryOptions = (
  pagination: PaginationFilter<TaskFilter>
): UseQueryOptions<HttpResponse<PaginationResult<TaskData>>, Error> => ({
  queryKey: ["tasks", pagination],
  queryFn: ({ queryKey }) => {
    const [, filter] = queryKey as [string, PaginationFilter<TaskFilter>];
    return getAllTasks(filter);
  },
  retry: false,
});
