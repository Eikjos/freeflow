'use server';

import { cookies } from 'next/headers';
import { HttpResponse } from '../types/http-response';

type ClientOptionsProps = {
  token?: string;
} & Omit<RequestInit, 'headers'>;

export const client = async <T>(
  endpoint: string,
  options: ClientOptionsProps = {},
  contentType: 'application/json' | 'other' = 'application/json',
): Promise<HttpResponse<T>> => {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('access_token');
  // const authToken = getAuthToken();
  const { token, ...otherOptions } = options;
  const headers: HeadersInit = {
    Authorization: `Bearer ${token ?? authToken?.value}`,
  };

  if (contentType !== 'other') {
    headers['Content-Type'] = contentType;
  }

  const response = await fetch(
    `${process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL}/${endpoint}`,
    {
      headers,
      credentials: 'include',
      ...otherOptions,
    },
  );

  if (!response.ok) {
    const error = (await response.json()) as Error;
    return {
      ok: false,
      data: undefined,
      error: error.message,
    };
  }
  const responseBody = await response.text();
  return {
    ok: true,
    data:
      responseBody.trim() !== '' ? (JSON.parse(responseBody) as T) : undefined,
    error: undefined,
  };
};
