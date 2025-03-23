import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateQueryString<T extends object>(filter: T): string {
  return Object.keys(filter)
    .map((k) => {
      const key = k as keyof T;
      const value = filter[key];

      if (typeof value === "object") {
        return generateQueryStringOfSubObject(key as string, value as object);
      }

      if (value !== undefined && value !== null) {
        return `${encodeURIComponent(key as string)}=${encodeURIComponent(String(value))}`;
      }

      return "";
    })
    .filter(Boolean)
    .join("&");
}

function generateQueryStringOfSubObject<T extends object>(
  key: string,
  filter: T
): string {
  return Object.keys(filter)
    .map((k) => {
      const keySub = k as keyof T;
      const value = filter[keySub];

      if (typeof value === "object") {
        return generateQueryString(value as object);
      }

      if (value !== undefined && value !== null) {
        return `${encodeURIComponent(key as string)}[${encodeURIComponent(keySub as string)}]=${encodeURIComponent(String(value))}`;
      }

      return "";
    })
    .filter(Boolean)
    .join("&");
}

export function getMediaUrl(mediaId: number) {
  return `${process.env.API_URL}/media/${mediaId}`;
}
