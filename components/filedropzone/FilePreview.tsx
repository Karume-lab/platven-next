import { Trash2 } from "lucide-react";
import Image from "next/image";
import prettyBytes from "pretty-bytes";
import { useEffect, useState } from "react";
import { DefaultExtensionType, FileIcon, defaultStyles } from "react-file-icon";
import { FormFile, fileExtensionsColors } from "./form-file";

const FilePreview = ({
  file,
  onDelete,
}: {
  file: File;
  onDelete?: () => void;
}) => {
  const ext = file.name.split("/").pop()?.split(".").pop();
  const [preview, setPreview] = useState<string>();

  useEffect(() => {
    (async () => {
      const preview = file.type.includes("image")
        ? (await FormFile.fromFile(file)).src
        : undefined;
      setPreview(preview);
    })();
  }, []);
  return (
    <div className="grid grid-cols-5">
      {preview ? (
        <Image
          className="w-20 h-20 object-cover rounded-lg m-[16px]"
          src={preview}
          width={200}
          height={100}
          alt={file.name}
        />
      ) : (
        <div className="w-[48px] m-[16px]">
          <FileIcon
            extension={ext as DefaultExtensionType}
            {...defaultStyles[ext as DefaultExtensionType]}
            labelColor={fileExtensionsColors[ext ?? "default"]}
          />
        </div>
      )}
      <div className="col-span-3 flex flex-col justify-center m-[16px] overflow-x-auto">
        <div className="">{file.name}</div>
        <div>{prettyBytes(file.size)}</div>
      </div>
      <Trash2
        className="text-red-900 hover:opacity-50 self-center"
        onClick={onDelete}
      />
    </div>
  );
};

export default FilePreview;
