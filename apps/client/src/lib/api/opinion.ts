import { OpinionData } from '@repo/shared-types';
import { queryOptions } from '@tanstack/react-query';
import { client } from '../client';

export const getOpinionRate = async (enterpriseId: number) =>
  await client<number>(`enterprises/${enterpriseId}/average-opinions-rate`);

export const getOpinionRateQueryOptions = (enterpriseId: number) =>
  queryOptions({
    queryKey: ['opinions', 'rate'],
    queryFn: () => getOpinionRate(enterpriseId),
    retry: false,
  });

export const getOpinions = async (enterpriseId: number) =>
  await client<OpinionData[]>(`enterprises/${enterpriseId}/opinions`);

export const getOpinionsQueryOptions = (enterpriseId: number) =>
  queryOptions({
    queryKey: ['opinions'],
    queryFn: () => getOpinions(enterpriseId),
    retry: false,
  });
