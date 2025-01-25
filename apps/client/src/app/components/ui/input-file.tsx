"use client";

import { useEffect, useState } from "react";
import { Label } from "./label";

type InputFileProps = {
  onFilesSelected: (file: File[]) => void;
};

const InputFile = ({ onFilesSelected }: InputFileProps) => {
  const [files, setFiles] = useState<File[]>([]);

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
          <div className="border-dashed border-2 p-4 rounded-lg border-accent bg-gray-100 text-sm text-center">
            <p>Drag and drop your files here</p>
            <p>
              Limit 15MB per file. Supported files: .PDF, .DOCX, .PPTX, .TXT,
              .XLSX
            </p>
            <Label htmlFor="browse">Browse files</Label>
          </div>
          <input
            type="file"
            hidden
            id="browse"
            onChange={handleFileChange}
            accept=".pdf,.docx,.pptx,.txt,.xlsx"
          />
        </>
      </div>
    </section>
  );
};

export default InputFile;
