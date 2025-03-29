import CardList from "@components/organisms/card-list";
import { Pagination } from "@components/ui/pagination";
import { Pagination as PaginationType, ProjectData } from "@repo/shared-types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getAllProjectsQueryOptions } from "../../../lib/api/projects";
import ProjectCard from "./project-card";
import { DeleteProject } from "actions/project";
import { toast } from "sonner";
import getQueryClient from "../../../lib/query-client";
import { useTranslations } from "next-intl";

type ProjectListProps = {
  enterpriseId: number;
};

export default function ProjectList({ enterpriseId }: ProjectListProps) {
  const [pagination, setPagination] = useState<PaginationType>({
    page: 0,
    pageSize: 6,
  });
  const queryClient = getQueryClient();
  const {
    data: projects,
    refetch,
    isLoading,
  } = useQuery(getAllProjectsQueryOptions(pagination, enterpriseId));
  const t = useTranslations();
  const handleChangePage = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const OnDeleteProject = (project: ProjectData) => {
    DeleteProject(project.id).then((res) => {
      if (res.ok) {
        queryClient.invalidateQueries({
          queryKey: ["projects", pagination],
        });
        toast.success(t("project.removeSuccess", { project: project.name }));
        // si il y a encore un projet après suppression
        if ((projects?.data?.data.length ?? 0) > 1 || pagination.page === 0) {
          refetch();
          // sinon aller sur la page précédente si elle permet
        } else {
          setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
        }
      } else {
        toast.error(t("project.removeFailed", { project: project.name }));
      }
    });
  };

  return (
    <>
      <CardList
        data={projects?.data?.data ?? []}
        render={(p, loading, key) => (
          <ProjectCard
            project={p}
            key={key}
            isLoading={loading}
            onDelete={OnDeleteProject}
          />
        )}
        isLoading={isLoading}
      />
      {(projects?.data?.totalItems ?? 0) > 0 && (
        <Pagination
          totalItems={projects?.data?.totalItems ?? 0}
          pageSize={projects?.data?.pageSize ?? 0}
          page={projects?.data?.page ?? 0}
          className="mt-10"
          onChangePage={handleChangePage}
        />
      )}
    </>
  );
}
