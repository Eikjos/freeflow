import {
  Pagination,
  PaginationResult,
  ProjectData,
  ProjectDetailWithTasks,
} from "@repo/shared-types";
import { queryOptions } from "@tanstack/react-query";
import { client } from "../client";
import { generateQueryString } from "../utils";

export const getAllProjects = (
  enterpriseId: number,
  pagination: Pagination
) => {
  const query = generateQueryString(pagination);
  return client<PaginationResult<ProjectData>>(
    `enterprises/${enterpriseId}/projects?${query}`
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

export const getProjectWithTasks = (id: number) =>
  client<ProjectDetailWithTasks>(`projects/${id}/details`);

export const getProjectWithTasksQueryOption = (id: number) =>
  queryOptions({
    queryFn: () => getProjectWithTasks(id),
    queryKey: ["projects", "tasks", id],
    retry: false,
  });
