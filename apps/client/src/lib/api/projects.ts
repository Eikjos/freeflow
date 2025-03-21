import { Pagination, PaginationResult, ProjectData } from "@repo/shared-types";
import { generateQueryString } from "../utils";
import { client } from "../client";
import { queryOptions } from "@tanstack/react-query";

export const getAllProjects = (
  enterpriseId: number,
  pagination: Pagination
) => {
  const query = generateQueryString(pagination);
  return client<PaginationResult<ProjectData>>(
    `enterprise/${enterpriseId}?${query}`
  );
};

export const getAllProjectsQueryOptions = (
  pagination: Pagination,
  enterpriseId: number
) =>
  queryOptions({
    queryFn: () => getAllProjects(enterpriseId, pagination),
    queryKey: ["projects", pagination, enterpriseId],
    retry: false,
  });
