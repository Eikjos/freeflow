'use server';

import { cookies } from 'next/headers';

export async function getAuthToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token');
  if (!token) {
    return null;
  }
  return token.value;
}
