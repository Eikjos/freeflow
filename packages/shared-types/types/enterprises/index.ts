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
  countryId: number;
};

export type EnterpriseCreateModel = {
  email: string;
  phone: string;
} & Omit<EnterpriseInformation, "id">;

export const EnterpriseCreateValidation = z.object({
  siret: z
    .string({ required_error: "Le numéro SIRET est requis." })
    .transform((val) => val.replace(/\s+/g, ""))
    .refine((val) => /^\d{14}$/.test(val), {
      message: "Le numéro SIRET doit contenir exactement 14 chiffres",
    }),
});
