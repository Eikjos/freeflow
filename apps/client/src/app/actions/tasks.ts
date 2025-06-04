"use server";

import { CreateTaskData, TaskData } from "@repo/shared-types";
import { client } from "../../lib/client";

export async function createTask(
  columnId: number,
  body: Omit<CreateTaskData, "files">,
  files?: File[]
) {
  const formData = new FormData();
  formData.append("name", body.name);
  if (body.description) {
    formData.append("description", body.description);
  }
  formData.append("priority", body.priority);
  formData.append("estimation", String(body.estimation));

  // Append mediaIds as JSON string if needed
  if (body.mediaIds && body.mediaIds.length > 0) {
    body.mediaIds.forEach((e) => {
      formData.append("mediaIds[]", String(e));
    });
  }

  // Append files individually
  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append("files", file);
    });
  }

  return await client<TaskData>(
    `columns/${columnId}/tasks`,
    {
      method: "POST",
      body: formData,
    },
    "other"
  ).then((res) => {
    if (res.ok) {
      return res.data;
    }
    throw new Error(res.error);
  });
}

export async function deleteTask(taskId: number) {
  return await client<void>(`tasks/${taskId}`, { method: "DELETE" }).then(
    (res) => {
      if (!res.ok) throw new Error(res.error);
    }
  );
}

export async function updateTask(
  taskId: number,
  body: CreateTaskData,
  files: File[]
) {
  const formData = new FormData();
  formData.append("name", body.name);
  if (body.description) {
    formData.append("description", body.description);
  }
  formData.append("priority", body.priority);
  formData.append("estimation", String(body.estimation));

  // Append mediaIds as JSON string if needed
  if (body.mediaIds && body.mediaIds.length > 0) {
    body.mediaIds.forEach((e) => {
      formData.append("mediaIds[]", String(e));
    });
  }

  // Append files individually
  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append("files", file);
    });
  }

  return await client<TaskData>(
    `tasks/${taskId}`,
    {
      method: "PUT",
      body: formData,
    },
    "other"
  ).then((res) => {
    if (res.ok) {
      return res.data;
    }
    throw new Error(res.error);
  });
}

export async function deleteMedia(taskId: number, mediaId: number) {
  return await client<void>(`tasks/${taskId}/medias/${mediaId}`, {
    method: "DELETE",
  }).then((res) => {
    if (!res.ok) {
      throw new Error(res.error);
    }
  });
}
