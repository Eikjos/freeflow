"use client";

import { Button } from "@components/ui/button";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function ProjectTab() {
  const t = useTranslations();
  return (
    <div className="w-full">
      <Button asChild className="float-right mr-5">
        <Link href={"/activities/projects/create"}>
          {t("common.add")} <Plus />
        </Link>
      </Button>
    </div>
  );
}
