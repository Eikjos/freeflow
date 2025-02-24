import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateQueryString<T extends object>(filter: T): string {
  return Object.keys(filter)
    .map((k) => {
      // Type assertion pour garantir que k est une clé valide de T
      const key = k as keyof T;
      const value = filter[key];

      // Vérification du type de la valeur (par exemple, pour éviter d'encoder une valeur non-string)
      if (value !== undefined && value !== null) {
        return `${encodeURIComponent(key as string)}=${encodeURIComponent(String(value))}`;
      }

      return ""; // Si la valeur est indéfinie ou null, on ne l'inclut pas dans la query string
    })
    .filter(Boolean) // On filtre les valeurs vides (par exemple, si la clé est `null` ou `undefined`)
    .join("&");
}
