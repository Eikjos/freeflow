import { Card, CardContent } from "@components/ui/card";
import { ArrowDownToLine, CircleXIcon, FileVideo } from "lucide-react";
import {
  FaFile,
  FaFileAlt,
  FaFileArchive,
  FaFileCode,
  FaFileExcel,
  FaFileImage,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileWord,
} from "react-icons/fa";
import { cn } from "../../../lib/utils";

type FileIconProps = {
  file: File;
  onDelete: (file: File) => void;
  className?: string;
  canDownload?: boolean;
};

export default function FileIcon({
  file,
  onDelete,
  className,
  canDownload,
}: FileIconProps) {
  const getFileIcon = (fileName: string) => {
    const extension = (fileName.split(".").pop() ?? "").toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(extension)) {
      return <FaFileImage color="#4dabf7" size={30} />;
    }
    if (["pdf"].includes(extension)) {
      return <FaFilePdf color="#e03131" size={30} />;
    }
    if (["doc", "docx"].includes(extension)) {
      return <FaFileWord color="#1971c2" size={30} />;
    }
    if (["xls", "xlsx", "csv"].includes(extension)) {
      return <FaFileExcel color="#2b8a3e" size={30} />;
    }
    if (["ppt", "pptx"].includes(extension)) {
      return <FaFilePowerpoint color="#e8590c" size={30} />;
    }
    if (["txt", "rtf", "odt"].includes(extension)) {
      return <FaFileAlt color="#495057" size={30} />;
    }
    if (["mp4", "avi", "mov"].includes(extension)) {
      return <FileVideo size={30} />;
    }
    if (["js", "jsx", "ts", "tsx", "html", "css", "json"].includes(extension)) {
      return <FaFileCode size={30} />;
    }
    if (
      ["zip", "rar", "7z", "tar", "gz", "bz2", "xz", "iso", "cab"].includes(
        extension
      )
    ) {
      return <FaFileArchive size={30} color="#f59f00" />;
    }
    return <FaFile color="#adb5bd" size={30} />;
  };

  const downloadFile = () => {
    const downloadLink = document.createElement("a");
    const objectURL = URL.createObjectURL(file);

    downloadLink.href = objectURL;
    downloadLink.download = file.name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(objectURL);
  };

  return (
    <div>
      <Card>
        <CardContent
          className={cn(
            "flex flex-col items-center justify-center p-3 h-24 relative",
            className
          )}
        >
          <div
            className="absolute w-5 h-5 rounded-full bg-destructive -top-2 -right-2 flex items-center justify-center text-white hover:cursor-pointer"
            onClick={() => onDelete(file)}
          >
            <CircleXIcon />
          </div>
          {canDownload && (
            <div
              className="absolute w-5 h-5 rounded-full bg-primary -top-2 -left-2 flex items-center justify-center text-white hover:cursor-pointer"
              onClick={downloadFile}
            >
              <ArrowDownToLine size={15} />
            </div>
          )}
          {getFileIcon(file.name)}
          <p className="text-[0.55rem] break-all w-[50px] line-clamp-2 mt-1 text-center">
            {file.name}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
