"use server";

import { ProjectCreateData, ProjectData } from "@repo/shared-types";
import { client } from "../../lib/client";

export const CreateProject = async (project: ProjectCreateData) => {
  const formData = new FormData();
  Object.keys(project).forEach((key) => formData.append(key, project[key]));

  return client<ProjectData>(
    `projects`,
    {
      method: "POST",
      credentials: "include",
      body: formData,
    },
    "other"
  )
    .then(async (data) => {
      return data;
    })
    .catch(() => {
      return null;
    });
};

export const UpdateProject = async (id: number, project: ProjectCreateData) => {
  const formData = new FormData();
  Object.keys(project).forEach((key) => formData.append(key, project[key]));

  return client<ProjectData>(
    `projects/${id}`,
    {
      method: "PUT",
      credentials: "include",
      body: formData,
    },
    "other"
  )
    .then(async (data) => {
      return data;
    })
    .catch(() => {
      return null;
    });
};

export const DeleteProject = async (id: number) => {
  return client<any>(`projects/${id}`, { method: "DELETE" });
};
