import { CreateExpenseData } from "@repo/shared-types";
import { client } from "../../lib/client";

export const createExpense = async (expense: CreateExpenseData) => {
  const formData = new FormData();
  const { expense: file, ...exp } = expense;
  Object.entries(exp).forEach(([key, value]) => {
    if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } else {
      if (value) {
        formData.append(key, value.toString());
      }
    }
  });
  if (file) formData.append("expense", file);

  return client<void>(
    `expenses`,
    {
      method: "POST",
      body: formData,
    },
    "other"
  ).then(async (res) => {
    if (res.ok) {
      return res.data;
    }
    throw new Error(res.error);
  });
};
