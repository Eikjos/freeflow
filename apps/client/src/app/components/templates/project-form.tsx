"use client";

import Autocomplete from "@components/molecules/autocomplete";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Form } from "@components/ui/form";
import { Input } from "@components/ui/input";
import InputFile from "@components/ui/input-file";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProjectCreateData,
  ProjectCreateValidation,
  ProjectDetailData,
} from "@repo/shared-types";
import { CreateProject, UpdateProject } from "actions/project";
import { Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getAllCustomersQueryOptions } from "../../../lib/api/customers";
import { cn, getMediaUrl } from "../../../lib/utils";
import getQueryClient from "../../../lib/query-client";

type ProjectFormProps = {
  className?: string;
  data?: ProjectDetailData;
  edit?: boolean;
  projectId?: number;
};

export default function ProjectForm({
  className,
  data,
  projectId,
  edit = false,
}: ProjectFormProps) {
  const t = useTranslations();
  const router = useRouter();
  const queryClient = getQueryClient();
  const form = useForm<ProjectCreateData>({
    resolver: zodResolver(ProjectCreateValidation),
    defaultValues: {
      name: data?.name ?? "",
      customerId: data?.customerId ?? undefined,
      media: undefined,
    },
  });
  const { media } = form.watch();

  const onChangeInput = (files: File[]) => {
    var file = files[files.length - 1];
    if (file) {
      form.setValue("media", file, { shouldValidate: true });
    } else {
      form.setValue("media", undefined, { shouldValidate: false });
    }
  };

  const onSubmit = (values: ProjectCreateData) => {
    if (edit && projectId) {
      UpdateProject(projectId, values).then((res) => {
        if (res === null) {
          toast.error(t("customer.error.create"));
        } else if (!res.ok && res.error) {
          toast.error(res.error);
        } else {
          toast.success("Projet a été mis à jour avec succès");
          router.push("/activities");
        }
      });
    } else {
      CreateProject(values).then((res) => {
        if (res === null) {
          toast.error(t("customer.error.create"));
        } else if (!res.ok && res.error) {
          toast.error(res.error);
        } else {
          toast.success("Projet créé avec succès");
          queryClient.invalidateQueries({ queryKey: ["project", projectId] });
          router.push("/activities");
        }
      });
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className={cn("p-5", className)}>
            <CardContent>
              <div className="flex flex-row items-center">
                <div className="w-1/2 pr-5 py-5 mr-5">
                  <Input
                    type="text"
                    {...form.register("name")}
                    label={t("common.name")}
                    placeholder="Nom du projet"
                  />
                  <Autocomplete
                    queryOptions={getAllCustomersQueryOptions}
                    filterField="name"
                    render={(customer) => customer.name}
                    fieldIdentifier="id"
                    {...form.register("customerId")}
                    label="Client"
                    className="mt-3"
                    placeholder="Sélectionner un client"
                  />
                </div>
                <div className="w-1/2 flex flex-col items-center gap-5 border-l-2 border-secondary pl-5 py-5">
                  <InputFile
                    onFilesSelected={onChangeInput}
                    multiple={false}
                    accept=".png, .jpeg, .jpg"
                  />
                  {(media || data?.mediaId) && (
                    <div>
                      <div className="flex flex-row justify-center items-center">
                        <span>{t("common.preview")} :</span>
                        <Image
                          src={
                            media
                              ? URL.createObjectURL(media)
                              : data?.mediaId
                                ? getMediaUrl(data?.mediaId)
                                : ""
                          }
                          width={100}
                          height={100}
                          className="h-20 w-20 object-contain ml-10 mr-3"
                          alt="Logo de votre entreprise"
                        />
                        <Trash2Icon
                          size={20}
                          onClick={() =>
                            form.setValue("media", undefined, {
                              shouldValidate: true,
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full flex flex-row justify-end mt-5">
                <Button type="submit">
                  {edit ? t("common.modify") : t("common.create")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </>
  );
}
