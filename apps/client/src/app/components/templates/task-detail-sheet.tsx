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
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

type TaskDetailSheetProps = {
  task: TaskData;
  open: boolean;
  onClose: () => void;
};

export default function TaskDetailSheet({
  task,
  open,
  onClose,
}: TaskDetailSheetProps) {
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

  const onSubmit = async (values: CreateTaskData) => {
    try {
      if (values.description) {
        const newValue = await uploadAndReplace(values.description);
        if (newValue) {
          values.description = newValue.value;
          values.mediaIds = newValue.images;
        }
      }
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message);
      }
    }
  };

  const handleDeleteFile = (file: File) => {
    form.setValue("files", files?.filter((f) => f !== file) ?? []);
  };

  const handleUploadFile = (files: File[]) => {
    form.setValue("files", files);
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-3xl font-medium font-amica">
            Détail d'une tache
          </SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            className="flex flex-col items-center mt-5"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <Input
              type="text"
              label="Nom"
              placeholder="Nom de la tâche"
              {...form.register("name")}
            />
            <Editor
              className="mt-3 mb-4"
              label={"Description"}
              placeholder="Ecrivez une description..."
              {...form.register("description")}
            />
            <Select
              label="Priorité"
              values={[
                { value: "HIGH", textValue: "Élevé" },
                { value: "MEDIUM", textValue: "Moyen" },
                { value: "LOW", textValue: "Faible" },
              ]}
              placeholder="Priorité"
              {...form.register("priority")}
            />
            <Input
              type="number"
              label="Estimation"
              placeholder="Estimation"
              {...form.register("estimation")}
            />
            {files && files.length > 0 && (
              <div className="flex flex-row items-center gap-3 mt-3 w-full py-2 overflow-x-auto">
                {files.map((f, index) => (
                  <FileIcon file={f} key={index} onDelete={handleDeleteFile} />
                ))}
              </div>
            )}
            <InputFile
              className="w-full mt-3"
              multiple
              onFilesSelected={handleUploadFile}
            />
            <Button type="submit" className="w-full mt-10">
              Editer
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
