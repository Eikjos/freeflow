'use server';

import { TaskData } from '@repo/shared-types';
import { client } from '../../lib/client';

export async function createTask(columnId: number, formData: FormData) {
  return await client<TaskData>(
    `columns/${columnId}/tasks`,
    {
      method: 'POST',
      body: formData,
    },
    'other',
  ).then((res) => {
    if (res.ok) {
      return res.data;
    }
    throw new Error(res.error);
  });
}

export async function deleteTask(taskId: number) {
  return await client<void>(`tasks/${taskId}`, { method: 'DELETE' }).then(
    (res) => {
      if (!res.ok) throw new Error(res.error);
    },
  );
}

export async function updateTask(taskId: number, formData: FormData) {
  return await client<TaskData>(
    `tasks/${taskId}`,
    {
      method: 'PUT',
      body: formData,
    },
    'other',
  ).then((res) => {
    if (res.ok) {
      return res.data;
    }
    throw new Error(res.error);
  });
}

export async function deleteMedia(taskId: number, mediaId: number) {
  return await client<void>(`tasks/${taskId}/medias/${mediaId}`, {
    method: 'DELETE',
  }).then((res) => {
    if (!res.ok) {
      throw new Error(res.error);
    }
  });
}
