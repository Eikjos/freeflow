"use client";

import { Button } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { ProjectData } from "@repo/shared-types";
import { Pen, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getMediaUrl } from "../../../lib/utils";

type ProjectCardProps = {
  project: ProjectData;
  isLoading: boolean;
  isCustomer: boolean;
  onDelete: (project: ProjectData) => void;
};

export default function ProjectCard({
  project,
  isLoading,
  isCustomer,
  onDelete,
}: ProjectCardProps) {
  const t = useTranslations();
  const router = useRouter();
  const goToDetails = () => {
    if (isCustomer) {
      router.push(`/customers/projects/${project.id}`);
    } else {
      router.push(`/activities/projects/${project.id}/tasks`);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-92 min-w-92 h-36">
        <CardContent>
          <CardHeader className="flex flex-row items-start px-0 justify-between">
            <div className="flex flex-row items-center gap-5">
              <div className="h-[50px] w-[50px] rounded-full bg-gray-200 animate-pulse"></div>
              <div className="flex flex-col gap-2">
                <CardTitle className="h-5 w-60 bg-gray-200 animate-pulse rounded-sm"></CardTitle>
                <CardDescription className="h-5 w-60 bg-gray-200 animate-pulse rounded-sm"></CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardFooter className="p-0 flex flex-row justify-end">
            <div className="w-full h-5 rounded-md bg-gray-200 animate-pulse"></div>
          </CardFooter>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="w-92 min-w-92 h-36">
      <CardContent>
        <CardHeader
          className="flex flex-row items-start px-0 justify-between hover:cursor-pointer"
          onClick={goToDetails}
        >
          <div className="flex flex-row items-center gap-5 h-[40px]">
            {project.media && (
              <img
                src={getMediaUrl(project.media)}
                width={50}
                height={50}
                loading="lazy"
                style={{ objectFit: "cover", objectPosition: "top" }}
                alt={`Image du projet ${project.name}`}
              />
            )}
            <div className="flex flex-col">
              <CardTitle className="font-light w-60 text-ellipsis text-nowrap overflow-hidden">
                {project.name}
              </CardTitle>
              <CardDescription className="text-sm w-60 text-ellipsis text-nowrap overflow-hidden">
                {isCustomer && (
                  <>
                    {t("common.serviceProvider")} : {project.enterprise}
                  </>
                )}
                {!isCustomer && (
                  <>
                    {t("common.customer")} : {project.customer}
                  </>
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardFooter className="p-0 flex flex-row justify-end">
          <div className="flex flex-row items-center gap-5">
            <Button variant={"outline"} asChild>
              <Link
                href={
                  isCustomer
                    ? `/customers/projects/${project.id}/edit`
                    : `/activities/projects/${project.id}/edit`
                }
              >
                <Pen size={18} className="text-primary hover:cursor-pointer" />
                {t("common.modify")}
              </Link>
            </Button>
            {!isCustomer && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant={"outline"}>
                    <Trash
                      size={18}
                      className="text-primary hover:cursor-pointer"
                    />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-3xl">
                      {t("project.dialog.removeTitle", {
                        project: project.name,
                      })}
                    </DialogTitle>
                    <p>
                      {t("project.dialog.removeDescription", {
                        project: project.name,
                      })}
                    </p>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant={"outline"}>
                          {t("common.cancel")}
                        </Button>
                      </DialogClose>
                      <DialogClose asChild>
                        <Button
                          variant={"destructive"}
                          onClick={() => onDelete(project)}
                        >
                          {t("common.remove")}
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
