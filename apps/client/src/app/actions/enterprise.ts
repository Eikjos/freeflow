'use server';

import {
  AuthResponseData,
  EditEnterpriseData,
  EnterpriseCreateModel,
  EnterpriseInformation,
} from '@repo/shared-types';
import { cookies } from 'next/headers';
import { client } from '../../lib/client';

export const fetchEnterpriseInfo = async (siret: string) =>
  client<EnterpriseInformation>(`enterprises/information?siret=${siret}`)
    .then((data) => {
      return data;
    })
    .catch(() => {
      return null;
    });

export const createEnterprise = async (
  enterprise: EnterpriseCreateModel,
  logo: File | undefined,
) => {
  const formData = new FormData();
  Object.keys(enterprise).forEach((key) =>
    formData.append(key, enterprise[key] as string),
  );
  if (logo) formData.append('logo', logo);
  const cookieStore = await cookies();
  return client<AuthResponseData>(
    `enterprises`,
    {
      method: 'POST',
      body: formData,
    },
    'other',
  ).then((res) => {
    if (res.ok && res.data) {
      cookieStore.set('access_token', res.data.access_token);
      cookieStore.set('refreshToken', res.data.refreshToken);
      return res.data;
    }
    throw new Error(res.error);
  });
};

export const updateEnterprise = async (
  id: number,
  enterprise: EditEnterpriseData,
  logo: File | undefined,
) => {
  const formData = new FormData();
  Object.keys(enterprise).forEach((key) =>
    formData.append(key, enterprise[key] as string),
  );
  if (logo) formData.append('logo', logo);
  const cookieStore = await cookies();

  return client<AuthResponseData>(
    `enterprises/${id}`,
    {
      method: 'PUT',
      body: formData,
    },
    'other',
  ).then((res) => {
    if (res.ok && res.data) {
      cookieStore.set('access_token', res.data.access_token);
      cookieStore.set('refreshToken', res.data.refreshToken);
      return res.data;
    }
    throw new Error(res.error);
  });
};
