'use client';

import Kanban from '@components/organisms/kanban';
import Loading from '@components/ui/loading';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { getProjectWithTasksQueryOption } from '../../../../../../../lib/api/projects';

type ProjectDetailsParams = {
  id: string;
};

export default function ProjectDetailWithTasksPage() {
  const { id } = useParams<ProjectDetailsParams>();
  const { data, isLoading } = useQuery(
    getProjectWithTasksQueryOption(parseInt(id)),
  );

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <h1 className="font-amica text-4xl mb-1">{data?.data?.name}</h1>
      {data && data.ok && data.data && (
        <Kanban
          projectId={data.data.id}
          className="min-h-[calc(100vh-150px)]  max-h-[calc(100vh-150px)]"
          columns={data.data.columns}
        />
      )}
    </>
  );
}
