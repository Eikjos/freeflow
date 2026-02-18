import {
  ProjectCreateData,
  ProjectData,
  ReOrderColumsData,
} from '@repo/shared-types';
import { client } from '../../lib/client';

export const CreateProject = (project: ProjectCreateData) => {
  const formData = new FormData();
  Object.keys(project).forEach((key) =>
    formData.append(key, project[key] as string),
  );

  return client<ProjectData>(
    `projects`,
    {
      method: 'POST',
      credentials: 'include',
      body: formData,
    },
    'other',
  )
    .then((data) => {
      return data;
    })
    .catch(() => {
      return null;
    });
};

export const UpdateProject = (id: number, project: ProjectCreateData) => {
  const formData = new FormData();
  Object.keys(project).forEach((key) =>
    formData.append(key, project[key] as string),
  );

  return client<ProjectData>(
    `projects/${id}`,
    {
      method: 'PUT',
      credentials: 'include',
      body: formData,
    },
    'other',
  )
    .then((data) => {
      return data;
    })
    .catch(() => {
      return null;
    });
};

export const deleteProject = (id: number) =>
  client(`projects/${id}`, { method: 'DELETE' });

export const reorderColumns = (id: number, model: ReOrderColumsData) =>
  client(`projects/${id}/columns/reorder`, {
    method: 'PATCH',
    body: JSON.stringify(model),
  });
