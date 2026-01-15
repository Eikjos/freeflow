
import { z } from "zod";
import { ColumnsData } from "../columns";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export type ProjectData = {
  id: number;
  name: string;
  customer: string;
  enterprise: string;
  media?: number;
};

export type ProjectCreateData = {
  name: string;
  customerId: number;
  media?: File;
  [key: string]: any;
};

export type ProjectDetailData = {
  id: number;
  customerId: number;
  mediaId: number;
  name: string;
};

export type ProjectDetailWithTasks = {
  id: number;
  customerId: number;
  mediaId: number;
  name: string;
  columns: ColumnsData[];
};

export const ProjectCreateValidation = z.object({
  name: z.string().min(1, "Le nom est requis"),
  customerId: z.number({ required_error: "Le client est requis." }),
  media: z
    .any()
    .optional()
    .refine(
      (file) => !file || file?.size <= MAX_FILE_SIZE,
      `Max image size is 5MB.`
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});
