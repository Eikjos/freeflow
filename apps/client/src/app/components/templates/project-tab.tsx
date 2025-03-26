"use client";

import { Button } from "@components/ui/button";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import ProjectList from "./project-list";

type ProjectTabProps = {
  enterpriseId: number;
};

export default function ProjectTab({ enterpriseId }: ProjectTabProps) {
  const t = useTranslations();
  return (
    <div className="w-full">
      <Button asChild className="float-right mr-5">
        <Link href={"/activities/projects/create"}>
          {t("common.add")} <Plus />
        </Link>
      </Button>
      <ProjectList enterpriseId={enterpriseId} />
    </div>
  );
}
