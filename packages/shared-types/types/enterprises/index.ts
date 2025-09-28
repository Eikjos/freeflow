import { z } from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export type EnterpriseInformation = {
  id: number;
  name: string;
  siret: string;
  address: string;
  zipCode: string;
  mediaId?: number;
  city: string;
  tvaNumber: string;
  juridicShape: string;
  socialCapital?: number;
  countryId: string;
};

export type EnterpriseCreateModel = {
  email: string;
  phone: string;
  prefixeInvoice?: string;
  lastInvoiceNumber?: number;
  logo?: File;
  [key: string]: any;
} & Omit<EnterpriseInformation, "id">;

export const EnterpriseCreateValidation = z.object({
  siret: z
    .string({ required_error: "Le numéro SIRET est requis." })
    .transform((val) => val.replace(/\s+/g, ""))
    .refine((val) => /^\d{14}$/.test(val), {
      message: "Le numéro SIRET doit contenir exactement 14 chiffres",
    }),
  name: z.string().min(1, "Le nom est requis"),
  address: z.string().min(1, "L'adresse est requis"),
  city: z.string().min(1, "La ville est requis"),
  zipCode: z.string().min(1, "Le nom est requis"),
  countryId: z
    .string({ required_error: "Le pays est requis." })
    .transform((val) => Number(val)),
  tvaNumver: z.string().optional(),
  juridicShape: z
    .string({ required_error: "La forme juridique est requis." })
    .min(1, "La forme juridique est requis."),
  email: z
    .string()
    .email("L'email est invalide.")
    .min(1, "L'email est requis."),
  phone: z.string().min(1, "Le numeor de telephone est requis."),
  logo: z
    .any()
    .optional()
    .refine(
      (file) => !file || file?.size <= MAX_FILE_SIZE,
      `Max image size is 5MB.`
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
  prefixeInvoice: z.string().optional(),
  lastNumberInvoice: z.coerce.number().optional(),
});
