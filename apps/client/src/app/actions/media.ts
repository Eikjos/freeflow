'use server';

import { client } from '../../lib/client';

export const uploadImg = async (formData: FormData) => {
  return await client<number>(
    'media',
    {
      method: 'POST',
      body: formData,
    },
    'other',
  ).then((res) => {
    if (res.ok && res.data) {
      return res.data;
    }
    throw new Error(res.error);
  });
};
