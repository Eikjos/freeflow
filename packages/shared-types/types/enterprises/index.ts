import { z } from "zod";

export type EnterpriseInformation = {
  id: number;
  name: string;
  siret: string;
  address: string;
  zipCode: string;
  city: string;
  TVANumber: string;
  juridicShape: string;
  socialCapital?: number;
  countryId: string;
};

export type EnterpriseCreateModel = {
  email: string;
  phone: string;
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
  TVANumber: z.string().min(1, "Le numero de TVA est requis."),
  juridicShape: z.string({ required_error: "La forme juridique est requis." }),
  email: z
    .string()
    .email("L'email est invalide.")
    .min(1, "L'email est requis."),
  phone: z.string().min(1, "Le numeor de telephone est requis."),
});
