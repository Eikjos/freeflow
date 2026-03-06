import { CreateOpinionData } from '@repo/shared-types';
import { client } from '../../lib/client';

export async function createOpinion(
  enterpriseId: number,
  opinion: CreateOpinionData,
) {
  return await client(`opinions?enterpriseId=${enterpriseId}`, {
    method: 'POST',
    body: JSON.stringify(opinion),
  }).then((res) => {
    if (res.ok) {
      return res.data;
    }
    throw new Error(res.error);
  });
}
