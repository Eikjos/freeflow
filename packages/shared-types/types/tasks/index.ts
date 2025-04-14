import { z } from "zod";

export type CreateTaskData = {
  name: string;
  description?: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  estimation: number;
};

export type TaskData = {
  id: number;
  name: string;
  description: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  index: number;
};

export const CreateTaskValidation = z.object({
  name: z.string().min(1, { message: "Le nom est requis" }),
  description: z.string(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"], {
    message: "La valeur est invalide",
  }),
  estimation: z.coerce.number().gte(0, "Must be 0 and above"),
});
