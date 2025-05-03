"use server";

import { ColumnsData, CreateColumnData } from "@repo/shared-types";
import { client } from "../../lib/client";

export async function createColumn(projectId: number, col: CreateColumnData) {
  return await client<ColumnsData>(`projects/${projectId}/columns`, {
    method: "POST",
    body: JSON.stringify(col),
  }).then((res) => {
    if (res.ok) {
      return res.data;
    }
    throw new Error(res.error);
  });
}

export async function updateColumn(id: number, col: CreateColumnData) {
  return await client<ColumnsData>(`columns/${id}`, {
    method: "POST",
    body: JSON.stringify(col),
  }).then((res) => {
    if (res.ok) {
      return res.data;
    }
    throw new Error(res.error);
  });
}
