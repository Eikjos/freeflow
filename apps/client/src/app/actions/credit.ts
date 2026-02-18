'use server';

import { CreateCreditData } from '@repo/shared-types';
import { client } from '../../lib/client';

export function createCredit(model: CreateCreditData, creditFile: File) {
  const formData = new FormData();
  const { creditLines, ...credit } = model;
  Object.entries(credit).forEach(([key, value]) => {
    if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } else {
      formData.append(key, value as string);
    }
  });
  formData.append(`creditLines`, JSON.stringify(creditLines));
  if (creditFile) formData.append('credit', creditFile);

  return client<void>(
    `credits`,
    {
      method: 'POST',
      body: formData,
    },
    'other',
  ).then((res) => {
    if (res.ok) {
      return res.data;
    }
    throw new Error(res.error);
  });
}
