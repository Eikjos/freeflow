"use client";

import FileIcon from "@components/atoms/file-icon";
import { Button } from "@components/ui/button";
import { Editor, uploadAndReplace } from "@components/ui/editor";
import { Form } from "@components/ui/form";
import { Input } from "@components/ui/input";
import InputFile from "@components/ui/input-file";
import { Select } from "@components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateTaskData,
  CreateTaskValidation,
  TaskData,
} from "@repo/shared-types";
import { deleteMedia, deleteTask, updateTask } from "actions/tasks";
import { TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { getImage } from "../../../lib/utils";

type TaskDetailSheetProps = {
  task: TaskData;
  open: boolean;
  onClose: () => void;
  onEdit?: (task: TaskData) => void;
  onDelete?: (task: TaskData) => void;
};

type FetchedFilesType = {
  mediaId: number;
  file: File;
};

const getDeletedFiles = (oldValue: string, newValue: string) => {
  const regExpImg = /\/media\/(\d+)/gi;
  const oldImages = [...oldValue.matchAll(regExpImg)]
    .map((m) => m[1])
    .filter((i) => i !== undefined);
  const newImages = [...newValue.matchAll(regExpImg)]
    .map((m) => m[1])
    .filter((i) => i !== undefined);

  return oldImages
    .filter((i) => !newImages.includes(i))
    .map((i) => parseInt(i));
};

export default function TaskDetailSheet({
  task,
  open,
  onClose,
  onEdit,
  onDelete,
}: TaskDetailSheetProps) {
  const t = useTranslations();
  const form = useForm<CreateTaskData>({
    resolver: zodResolver(CreateTaskValidation),
    defaultValues: {
      ...task,
    },
  });
  const files = useWatch({
    control: form.control,
    name: "files",
  });

  const [fetchedFiles, setFetchedFiles] = useState<FetchedFilesType[]>([]);

  useEffect(() => {
    const fetchAllFiles = async () => {
      if (!task.mediaIds?.length) return;

      try {
        const files = await Promise.all(
          task.mediaIds.map(async (m) => ({
            mediaId: m,
            file: await getImage(m),
          }))
        );
        setFetchedFiles(files);
      } catch (e) {
        toast.error("Erreur lors du chargement des fichiers");
      }
    };

    fetchAllFiles();
  }, [task.mediaIds]);

  const onSubmit = async (values: CreateTaskData) => {
    try {
      if (values.description) {
        const newValue = await uploadAndReplace(values.description);
        if (newValue) {
          values.description = newValue.value;
          values.mediaIds = newValue.images;
          const deletedImage = getDeletedFiles(
            task.description ?? "",
            newValue.value ?? ""
          );
          deletedImage.forEach((i) => {
            deleteMedia(task.id, i);
          });
        }
      }

      updateTask(task.id, values, form.getValues("files") ?? [])
        .then((res) => {
          if (res) {
            if (onEdit) {
              console.log("api", res);
              onEdit(res);
            }
          }
        })
        .then(() => onClose())
        .catch((e) => toast.error(e.message));
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message);
      }
    }
  };

  const handleDelete = () => {
    deleteTask(task.id)
      .then(() => {
        if (onDelete) {
          onDelete(task)
        }
      })
      .catch((e) => toast.error(e.message))
      .finally(() => onClose());
  };

  const handleDeleteFile = (file: File) => {
    form.setValue("files", files?.filter((f) => f !== file) ?? []);
  };

  const handleUploadFile = (files: File[]) => {
    form.setValue("files", files);
  };

  const handleDeleteFilesAlreadyUploaded = (file: File, mediaId: number) => {
    deleteMedia(task.id, mediaId)
      .catch((err) => toast.error(err.message))
      .then(() => {
        setFetchedFiles((prev) => prev.filter((e) => e.mediaId !== mediaId));
      });
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="overflow-x-auto">
        <SheetHeader>
          <SheetTitle className="text-3xl font-medium font-amica">
            {t("task.detailTitle")}
          </SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            className="flex flex-col items-center mt-5"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <Input
              type="text"
              label={t("common.name")}
              placeholder={t("task.namePlaceholder")}
              {...form.register("name")}
            />
            <Editor
              className="mt-3 mb-4"
              label={t("common.description")}
              placeholder={t("common.enterDescription")}
              {...form.register("description")}
            />
            <Select
              label={t("task.priority")}
              values={[
                { value: "HIGH", textValue: "Élevé" },
                { value: "MEDIUM", textValue: "Moyen" },
                { value: "LOW", textValue: "Faible" },
              ]}
              placeholder={t("task.priority")}
              {...form.register("priority")}
            />
            <Input
              type="number"
              label={t("task.estimation")}
              placeholder={t("task.estimation")}
              {...form.register("estimation")}
            />
            <div className="flex flex-row items-center gap-3 mt-3 w-full py-2 overflow-x-auto pl-2">
              {fetchedFiles.length > 0 && (
                <>
                  {" "}
                  {fetchedFiles.map((file) => (
                    <FileIcon
                      file={file.file}
                      key={file.mediaId}
                      onDelete={(f) =>
                        handleDeleteFilesAlreadyUploaded(f, file.mediaId)
                      }
                      canDownload
                    />
                  ))}
                </>
              )}
              {files && files.length > 0 && (
                <>
                  {files.map((f, index) => (
                    <FileIcon
                      file={f}
                      key={index}
                      onDelete={handleDeleteFile}
                    />
                  ))}
                </>
              )}
            </div>
            <InputFile
              className="w-full mt-3"
              multiple
              onFilesSelected={handleUploadFile}
            />
            <div className="flex flex-row mt-10 w-full gap-2">
              {onEdit && (
                <Button type="submit" className="w-3/4">
                  {t("common.edit")}
                </Button>
              )}
              {onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  className="w-1/4"
                  onClick={handleDelete}
                >
                  <TrashIcon />
                </Button>
              )}
             
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
