"use server";

import { cookies } from "next/headers";

type ClientOptionsProps = {
  body?: any;
  token?: string;
} & Omit<RequestInit, "body" | "headers">;

export const client = async <T>(
  endpoint: string,
  options: ClientOptionsProps = {}
): Promise<T> => {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("access_token");
  console.log(authToken);
  // const authToken = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const { token, ...otherOptions } = options;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL}/${endpoint}`,
    {
      headers: {
        ...headers,
        Authorization: `Bearer ${token ?? authToken?.value}`,
      },
      credentials: "include",
      ...otherOptions,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "An error occurred");
  }

  return (await response.json()) as T;
};
