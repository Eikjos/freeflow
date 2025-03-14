"use client";

import { CloudUpload } from "lucide-react";
import { ComponentProps } from "react";
import { Label } from "./label";
import { useTranslations } from "next-intl";

type InputFileProps = {
  onFilesSelected: (files: File[]) => void;
  errorMessage?: string;
} & Omit<ComponentProps<"input">, "name" | "type">;

const InputFile = ({
  onFilesSelected,
  errorMessage,
  ...props
}: InputFileProps) => {
  const t = useTranslations();
  const handleFileChange = (event: any) => {
    const selectedFiles: File[] = event.target.files;
    // if (selectedFiles && selectedFiles.length > 0) {
    //   const newFiles = Array.from(selectedFiles);
    //   setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    // }
    onFilesSelected(selectedFiles);
  };
  const handleDrop = (event: any) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      onFilesSelected(droppedFiles);
    }
  };

  return (
    <section>
      <div
        className={`document-uploader`}
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
      >
        <>
          <div className="border-dashed border-2 p-4 rounded-lg border-orange-500/50 bg-orange-50 text-sm text-center">
            <p>{t("common.dropFile")}</p>
            <p>
              {t("common.supportedFile")} {props.accept}
            </p>
            <Label
              htmlFor="browse"
              className="flex flew-row justify-center mt-2"
            >
              <CloudUpload className="hover:text-primary" />
            </Label>
            {errorMessage && (
              <p className="text-sm font-medium text-destructive text-center">
                {errorMessage}
              </p>
            )}
          </div>
          <input
            type="file"
            hidden
            id="browse"
            onChange={handleFileChange}
            accept={props.accept}
            multiple={props.multiple}
          />
        </>
      </div>
    </section>
  );
};

export default InputFile;
