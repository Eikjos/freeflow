import { z } from "zod";

export type AuthResponseData = {
  userId: number;
  firstName: string;
  lastName: string;
  role: "enterprise" | "customer";
  enterpriseId?: number;
  access_token: string;
  refreshToken: string;
};

export const LoginDataValidation = z.object({
  email: z
    .string()
    .min(1, { message: "L'email est requis." })
    .email({ message: "L'email est invalide." }),
  password: z.string().min(1, { message: "Le mot de passe est requis." }),
});

export type LoginData = z.infer<typeof LoginDataValidation>;
