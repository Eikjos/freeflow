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
    .string()
    .min(1, { message: "L'email est requis." })
    .email({ message: "L'email est invalide." }),
  password: z.string().min(1, { message: "Le mot de passe est requis." }),
});
