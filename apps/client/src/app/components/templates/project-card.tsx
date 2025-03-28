import { Button } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { ProjectData } from "@repo/shared-types";
import { Pen, Trash } from "lucide-react";
import Image from "next/image";
import { getMediaUrl } from "../../../lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { useTranslations } from "next-intl";
import Link from "next/link";

type ProjectCardProps = {
  project: ProjectData;
  isLoading: boolean;
};

export default function ProjectCard({ project, isLoading }: ProjectCardProps) {
  const t = useTranslations();
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
        <CardHeader className="flex flex-row items-start px-0 justify-between">
          <div className="flex flex-row items-center gap-5 h-[40px]">
            {project.media && (
              <Image
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
                Client : {project.customer}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardFooter className="p-0 flex flex-row justify-end">
          <div className="flex flex-row items-center gap-5">
            <Button variant={"outline"} asChild>
              <Link href={`/activities/projects/${project.id}/edit`}>
                <Pen size={18} className="text-primary hover:cursor-pointer" />
                Modifier
              </Link>
            </Button>

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
                    Suppression du projet {project.name}
                  </DialogTitle>
                  <p>
                    {t("customer.dialog.removeDescription", {
                      customer: project.name,
                    })}
                  </p>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant={"outline"}>{t("common.cancel")}</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button
                        variant={"destructive"}
                        onClick={() => console.log(project.id)}
                      >
                        {t("common.remove")}
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
