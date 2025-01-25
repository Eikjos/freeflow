"use client";

import { ComponentProps, useEffect, useState } from "react";
import { Label } from "./label";
import { CloudUpload } from "lucide-react";

type InputFileProps = {
  onFilesSelected: (files: Blob[]) => void;
} & Omit<ComponentProps<"input">, "name" | "type">;

const InputFile = ({ onFilesSelected, ...props }: InputFileProps) => {
  const [files, setFiles] = useState<Blob[]>([]);

  const handleFileChange = (event: any) => {
    const selectedFiles: File[] = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles = Array.from(selectedFiles);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };
  const handleDrop = (event: any) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const newFiles: File[] = Array.from(droppedFiles);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  useEffect(() => {
    onFilesSelected(files);
  }, [files, onFilesSelected]);

  return (
    <section>
      <div
        className={`document-uploader ${
          files.length > 0 ? "upload-box active" : "upload-box"
        }`}
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
      >
        <>
          <div className="border-dashed border-2 p-4 rounded-lg border-orange-500/50 bg-orange-50 text-sm text-center">
            <p>Glisser vos fichiers ici</p>
            <p>Fichier supporté: {props.accept}</p>
            <Label
              htmlFor="browse"
              className="flex flew-row justify-center mt-2"
            >
              <CloudUpload className="hover:text-primary" />
            </Label>
          </div>
          <input
            type="file"
            hidden
            id="browse"
            onChange={handleFileChange}
            accept={props.accept}
          />
        </>
      </div>
    </section>
  );
};

export default InputFile;
