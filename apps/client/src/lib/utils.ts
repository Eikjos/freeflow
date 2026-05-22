import { InvoiceStatus } from '@repo/shared-types';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateQueryString<T extends object>(filter: T): string {
  return Object.keys(filter)
    .map((k) => {
      const key = k as keyof T;
      const value = filter[key];

      if (typeof value === 'object') {
        return generateQueryStringOfSubObject(key as string, value as object);
      }

      if (value !== undefined && value !== null) {
        return `${encodeURIComponent(key as string)}=${encodeURIComponent(String(value))}`;
      }

      return '';
    })
    .filter(Boolean)
    .join('&');
}

function generateQueryStringOfSubObject<T extends object>(
  key: string,
  filter: T,
): string {
  return Object.keys(filter)
    .map((k) => {
      const keySub = k as keyof T;
      const value = filter[keySub];

      if (typeof value === 'object') {
        return generateQueryString(value as object);
      }

      if (value !== undefined && value !== null) {
        return `${encodeURIComponent(key)}[${encodeURIComponent(keySub as string)}]=${encodeURIComponent(String(value))}`;
      }

      return '';
    })
    .filter(Boolean)
    .join('&');
}

export function getMediaUrl(mediaId: number) {
  return `${process.env.NEXT_PUBLIC_API_URL}/media/${mediaId}`;
}

export async function getImage(mediaId: number) {
  const file = await fetch(getMediaUrl(mediaId));
  const contentDisposition = file.headers.get('Content-Disposition');
  let filename = `fichier-${mediaId}`;
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="(.+)"/);
    if (match && match[1]) {
      filename = match[1].replace(/['"]/g, '');
    }
  }
  const blob = await file.blob();
  return new File([blob], filename, { type: blob.type });
}

export const formatPrice = (
  value: number,
  userLocale: string,
  currency: string,
) =>
  new Intl.NumberFormat(userLocale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(value)
    .replace(/\u202F/g, ' ');

export const invoiceStatusToString = (invoiceStatus: InvoiceStatus) => {
  switch (invoiceStatus) {
    case 'WAITING_VALIDATION':
      return 'En attente de validation';
    case 'VALIDATE':
      return 'Validé';
    case 'WAITING_PAYED':
      return 'En attente de paiement';
    case 'PAYED':
      return 'Payée';
    case 'CREDITED':
      return 'Crédité';
    case 'PARTIAL_CREDITED':
      return 'Partiellement crédité';
    case 'REJECTED':
      return 'Refusé';
  }
};

export function numberToMonth(m: number): string {
  switch (m) {
    case 0:
      return 'Janvier';
    case 1:
      return 'Février';
    case 2:
      return 'Mars';
    case 3:
      return 'Avril';
    case 4:
      return 'Mai';
    case 5:
      return 'Juin';
    case 6:
      return 'Juillet';
    case 7:
      return 'Août';
    case 8:
      return 'Septembre';
    case 9:
      return 'Octobre';
    case 10:
      return 'Novembre';
    case 11:
      return 'Décembre';
    default:
      return 'Mois invalide';
  }
}

export function stringToDateYear(date: string) {
  const regex = /(\d+)-(\d+)/;
  const match = date.match(regex);
  if (match) {
    const year = match[1];
    const month = parseInt(match[2]!) - 1;
    return numberToMonth(month) + ' ' + year;
  }
  return date;
}

export function toFormData(data: any) {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item instanceof File || item instanceof Blob) {
          formData.append(key, item);
        } else if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(item));
        }
      });
    } else if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    } else if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } else if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
}

export function generateFilenameFromBase64(base64: string): string {
  const mimeMatch = base64.match(/^data:(image\/[a-z]+);base64,/);
  const extension = mimeMatch ? mimeMatch[1]?.split('/')[1] : 'png';
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `image-${timestamp}-${random}.${extension}`;
}

export function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(',');
  const mime = arr[0]?.match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]!);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}
