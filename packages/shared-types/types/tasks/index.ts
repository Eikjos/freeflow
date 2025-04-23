import { z } from "zod";

export type CreateTaskData = {
  name: string;
  description?: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  files?: File[];
  mediaIds?: number[];
  estimation?: number;
};

export type TaskData = {
  id: number;
  name: string;
  columnId: number;
  description: string;
  estimation?: number;
  priority: "HIGH" | "MEDIUM" | "LOW";
  index: number;
  mediaIds: number[];
};

export const CreateTaskValidation = z.object({
  name: z.string().min(1, { message: "Le nom est requis" }),
  description: z.string(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"], {
    message: "La valeur est invalide",
  }),
  estimation: z.coerce.number().gte(0, "Must be 0 and above").optional(),
});
