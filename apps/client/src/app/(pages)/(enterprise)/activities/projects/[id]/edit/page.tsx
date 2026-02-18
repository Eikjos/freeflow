'use server';

import ProjectForm from '@components/templates/project-form';
import { ProjectDetailData } from '@repo/shared-types';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { client } from '../../../../../../../lib/client';

type EditProjectParams = {
  id: string;
};

type EditCustomerPageProps = {
  params: Promise<EditProjectParams>;
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
            {t('project.edit', { project: project.data?.name ?? '' })}
          </h1>
          <ProjectForm edit projectId={parseInt(id)} data={project.data} />
        </>
      )}
    </div>
  );
}
