import {
  Pagination,
  PaginationResult,
  ProjectData,
  ProjectDetailWithTasks,
} from '@repo/shared-types';
import { queryOptions } from '@tanstack/react-query';
import { client } from '../client';
import { generateQueryString } from '../utils';

export const getAllProjects = (
  pagination: Pagination,
  customerId?: number,
  enterpriseId?: number,
) => {
  const query = generateQueryString(pagination);
  if (enterpriseId && !customerId) {
    return client<PaginationResult<ProjectData>>(
      `enterprises/${enterpriseId}/projects?${query}`,
    );
  } else {
    return client<PaginationResult<ProjectData>>(
      `customers/${customerId}/projects?${query}`,
    );
  }
};

export const getAllProjectsQueryOptions = (
  pagination: Pagination,
  enterpriseId?: number,
  customerId?: number,
) =>
  queryOptions({
    queryFn: () => getAllProjects(pagination, customerId, enterpriseId),
    queryKey: ['projects', pagination, enterpriseId, customerId],
    retry: false,
  });

export const getProjectWithTasks = (id: number) =>
  client<ProjectDetailWithTasks>(`projects/${id}/details`);

export const getProjectWithTasksQueryOption = (id: number) =>
  queryOptions({
    queryFn: () => getProjectWithTasks(id),
    queryKey: ['projects', 'tasks', id],
    retry: false,
  });
