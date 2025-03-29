"use server";

import { ProjectDetailData } from "@repo/shared-types";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { client } from "../../../../../../../lib/client";
import ProjectForm from "@components/templates/project-form";

type EditCustomerParams = {
  id: string;
};

type EditCustomerPageProps = {
  params: Promise<EditCustomerParams>;
};

export default async function EditProjectPage({
  params,
}: EditCustomerPageProps) {
  const { id } = await params;
  const project = await client<ProjectDetailData>(`projects/${id}`);
  const t = await getTranslations();

  if (project && !project.ok) {
    notFound();
  }

  return (
    <div>
      {project && project?.ok && (
        <>
          <h1 className="font-amica text-4xl mb-20">
            {t("project.edit", { project: project.data?.name })}
          </h1>
          <ProjectForm edit projectId={parseInt(id)} data={project.data} />
        </>
      )}
    </div>
  );
}
