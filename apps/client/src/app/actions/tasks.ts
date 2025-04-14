"use server";

import { CreateTaskData, TaskData } from "@repo/shared-types";
import { client } from "../../lib/client";

export async function createTask(columnId: number, body: CreateTaskData) {
  return await client<TaskData>(`columns/${columnId}/tasks`, {
    method: "POST",
    body: JSON.stringify(body),
  }).then((res) => {
    if (res.ok) {
      return res.data;
    }
    throw new Error(res.error);
  });
}
