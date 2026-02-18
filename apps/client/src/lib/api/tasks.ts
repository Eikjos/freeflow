import {
  PaginationFilter,
  PaginationResult,
  TaskData,
  TaskFilter,
} from '@repo/shared-types';
import { queryOptions, UseQueryOptions } from '@tanstack/react-query';
import { HttpResponse } from '../../types/http-response';
import { client } from '../client';
import { generateQueryString } from '../utils';

export const getAllTasks = async (pagination: PaginationFilter<TaskFilter>) => {
  const query = generateQueryString(pagination);
  return await client<PaginationResult<TaskData>>(`tasks?${query}`);
};

export const getTasksById = async (id: number) => {
  return await client<TaskData>(`tasks/${id}`);
};

export const getAllTasksQueryOptions = (
  pagination: PaginationFilter<TaskFilter>,
): UseQueryOptions<HttpResponse<PaginationResult<TaskData>>, Error> => ({
  queryKey: ['tasks', pagination],
  queryFn: () => getAllTasks(pagination),
  retry: false,
});

export const getUrgentTasks = async () => {
  return await client<TaskData[]>(`tasks/urgents`);
};

export const getUrgentTasksQueryOptions = () =>
  queryOptions({
    queryFn: getUrgentTasks,
    queryKey: ['tasks', 'urgents'],
    retry: false,
  });
