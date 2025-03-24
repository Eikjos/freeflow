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
