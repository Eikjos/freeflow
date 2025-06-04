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
  return `${process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL}/media/${mediaId}`;
}

export async function getImage(mediaId: number) {
  const file = await fetch(getMediaUrl(mediaId));
  const contentDisposition = file.headers.get("Content-Disposition");
  let filename = `fichier-${mediaId}`;
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="(.+)"/);
    if (match && match[1]) {
      filename = match[1].replace(/['"]/g, "");
    }
  }
  const blob = await file.blob();
  return new File([blob], filename, { type: blob.type });
}
