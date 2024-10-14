import { FileText, Trash2 } from "lucide-react";

import { useHover } from "hooks/useHover";
import cn from "lib/cn";

const File = ({
  file,
  onRemove,
}: {
  file: File;
  onRemove: (file: File) => void;
}) => {
  const { ref, isHovered } = useHover<HTMLDivElement>();
  const fileType = file.type;
  const isImage = fileType.startsWith("image/");

  const handleRemove = () => {
    onRemove(file);
  };

  return (
    <div
      ref={ref}
      onClick={handleRemove}
      className={cn(
        "relative flex items-center justify-center",
        isHovered && "cursor-pointer"
      )}
    >
      {isHovered && (
        <>
          <div className="bg-background-200/50 absolute inset-0 cursor-pointer flex justify-center items-center " />
          <Trash2 className="w-8 h-8 text-foreground-200 p-2 rounded-full absolute-center bg-background-800" />
        </>
      )}
      {isImage ? (
        <img
          src={URL.createObjectURL(file)}
          alt={`Image: ${file.name}`}
          className="h-16 w-16 object-cover rounded-lg"
        />
      ) : (
        <div className="flex items-center w-[10rem] h-16 space-x-2 px-3 border border-gray-700 rounded-lg">
          <FileText className="w-8 h-8 shrink-0" color="gray" />
          <span className="line-clamp-1">{file.name}</span>
        </div>
      )}
    </div>
  );
};

export default File;
