import { z } from 'zod';

export type CreateUserData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export const CreateUserDataValidation = z
  .object({
    firstName: z.string().min(1, { message: 'Le prénom est requis.' }),
    lastName: z.string().min(1, { message: 'Le nom est requis' }),
    email: z
      .string()
      .email({ message: "L'addresse mail est invalide." })
      .min(1, { message: "L'addresse mail est requis" }),
    password: z.string().min(8, {
      message: 'Le mot de passe doit contenir au minimum 8 caractères',
    }),
    confirmPassword: z.string().min(8, {
      message: 'Le mot de passe doit contenir au miminim 8 caractères.',
    }),
  })
  .refine((val) => val.password == val.confirmPassword, {
    message: 'Les mots de passe doivent être identiques',
    path: ['confirmPassword'],
  });
