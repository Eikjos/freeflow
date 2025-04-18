"use client";

import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { cn } from "../../../lib/utils";
import "../../editor.css";
import { FormLabel } from "./form";

type EditorProps = {
  className?: string;
  label?: string;
};

export default function Editor({ className, label }: EditorProps) {
  const [value, setValue] = useState<string>("");
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "code-block"],
      ["clean"],
    ],
  };

  const formats = ["bold", "italic", "underline", "list", "image"];

  const handleChange = (v: string) => {
    setValue(v);
  };

  return (
    <div className={cn(className)}>
      {label && <FormLabel>{label}</FormLabel>}
      <div>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={handleChange}
          formats={formats}
          placeholder="Ecris ton contenu ici...."
          modules={modules}
        />
      </div>
    </div>
  );
}
