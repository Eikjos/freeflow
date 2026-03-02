import { z } from 'zod';

export type OpinionData = {
  id: number;
  content: string;
  customer: string;
  enterpriseId: number;
  rate: number;
  createdAt: Date;
};

export type CreateOpinionData = {
  content: string;
  rate: number;
};

export const CreateOpinionDataValidation = z.object({
  content: z.string().min(1, { message: "L'avis doit avoir un contenu." }),
  rate: z
    .number()
    .min(0.5, 'La note doit être au minumum 0,5')
    .max(5, 'La note ne doit pas dépassé 5'),
});
