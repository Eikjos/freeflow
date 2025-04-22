"use client";

import { CloudUpload } from "lucide-react";
import { useTranslations } from "next-intl";
import { ComponentProps, useRef, useState } from "react";
import { Label } from "./label";

type InputFileProps = {
  onFilesSelected: (files: File[]) => void;
  showFiles?: boolean;
  errorMessage?: string;
} & Omit<ComponentProps<"input">, "name" | "type">;

const InputFile = ({
  onFilesSelected,
  errorMessage,
  showFiles = false,
  ...props
}: InputFileProps) => {
  const t = useTranslations();
  const [files, setFiles] = useState<File[]>([]);
  const ref = useRef<HTMLInputElement>(null);
  const handleFileChange = (event: any) => {
    const selectedFiles: File[] = Array.from(event.target.files);
    if (ref.current) {
      ref.current.value = "";
    }
    setFiles((prev) => [...prev, ...selectedFiles]);
    onFilesSelected(files);
  };
  const handleDrop = (event: any) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      onFilesSelected(droppedFiles);
    }
  };

  return (
    <section className={props.className}>
      <div
        className={`document-uploader`}
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
      >
        <>
          <div className="border-dashed border-2 p-4 rounded-lg border-orange-500/50 bg-orange-50 text-sm text-center w-full">
            <p>{t("common.dropFile")}</p>
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
            value={undefined}
            ref={ref}
          />
        </>
      </div>
      {showFiles && (
        <div>
          {files.map((f, index) => (
            <div key={index}>{f.name}</div>
          ))}
        </div>
      )}
    </section>
  );
};

export default InputFile;
