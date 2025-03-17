"use server";

import { cookies } from "next/headers";
import { HttpResponse } from "../types/http-response";

type ClientOptionsProps = {
  body?: any;
  token?: string;
} & Omit<RequestInit, "body" | "headers">;

export const client = async <T>(
  endpoint: string,
  options: ClientOptionsProps = {}
): Promise<HttpResponse<T>> => {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("access_token");
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
      responseBody.trim() !== "" ? (JSON.parse(responseBody) as T) : undefined,
    error: undefined,
  };
};
