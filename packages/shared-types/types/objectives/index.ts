import { z } from "zod";

export type ObjectiveCategory = "CUSTOMER" | "SALES";

export type ObjectiveData = {
  id: number;
  startDate: Date;
  endDate: Date;
  currentNumber: number;
  objectiveNumber: number;
  objectiveCategory: ObjectiveCategory;
  enterpriseId: number;
};

export type CreateObjectiveData = {
  startDate?: Date;
  endDate: Date;
  objectiveNumber: number;
  objectiveCategory: ObjectiveCategory;
};

export const CreateObjectiveDataValidation = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce
    .date({ required_error: "Required" })
    .min(new Date(), { message: "objective.validation.endDate" }),
  objectiveNumber: z.coerce
    .number()
    .min(1, { message: "objective.validation.number" }),
  objectiveCategory: z.enum(["SALES", "CUSTOMER"]),
});
