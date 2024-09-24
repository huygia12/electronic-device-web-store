import { cn } from "@/lib/utils";
import { FC, HTMLAttributes } from "react";

interface FileImagePlaceholderProps extends HTMLAttributes<HTMLDivElement> {
  isDragActive?: boolean;
}

const FileImagePlaceholder: FC<FileImagePlaceholderProps> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "border-2 border-dashed border-gray-400 bg-slate-100 rounded-md flex justify-center items-center",
        className,
        props.isDragActive && "bg-gray-200"
      )}
    >
      {props.isDragActive ? (
        <img src="/image-upload.svg" />
      ) : (
        <span className="text-slate-500 text-center">
          Chọn hoặc <br /> kéo File
        </span>
      )}
    </div>
  );
};

export default FileImagePlaceholder;
