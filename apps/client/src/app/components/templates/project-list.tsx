import CardList from "@components/organisms/card-list";
import { Pagination } from "@components/ui/pagination";
import { Pagination as PaginationType } from "@repo/shared-types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getAllProjectsQueryOptions } from "../../../lib/api/projects";
import ProjectCard from "./project-card";

type ProjectListProps = {
  enterpriseId: number;
};

export default function ProjectList({ enterpriseId }: ProjectListProps) {
  const [pagination, setPagination] = useState<PaginationType>({
    page: 0,
    pageSize: 6,
  });
  const {
    data: projects,
    refetch,
    isLoading,
  } = useQuery(getAllProjectsQueryOptions(pagination, enterpriseId));

  const handleChangePage = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  return (
    <>
      <CardList
        data={projects?.data?.data ?? []}
        render={(p, loading, key) => (
          <ProjectCard project={p} key={key} isLoading={loading} />
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
