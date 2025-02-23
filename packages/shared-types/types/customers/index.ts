import { z } from "zod";

export const CustomerCreateValidation = z.object({
  siret: z
    .string()
    .optional()
    .transform((val) => {
      if (val) {
        return val.replace(/\s+/g, "");
      }
      return undefined;
    })
    .refine(
      (val) => {
        if (val) return /^\d{14}$/.test(val);
        return true;
      },
      {
        message: "Le numéro SIRET doit contenir exactement 14 chiffres",
      }
    ),
  name: z.string().min(1, "Le nom est requis"),
  address: z.string().min(1, "L'adresse est requis"),
  city: z.string().min(1, "La ville est requis"),
  zipCode: z.string().min(1, "Le nom est requis"),
  countryId: z
    .string({ required_error: "Le pays est requis." })
    .transform((val) => Number(val)),
  TVANumber: z.string().optional(),
  email: z
    .string({ required_error: "L'email est requis." })
    .email("L'email est invalide.")
    .min(1, "L'email est requis."),
  phone: z.string().min(1, "Le numeor de telephone est requis."),
});

export type CustomerCreateModel = z.infer<typeof CustomerCreateValidation>;
