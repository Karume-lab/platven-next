"use client";
import React from "react";
import FileDropZone from "./FileDropZone";
import FilePreview from "./FilePreview";
interface Props {
  value?: File[];
  onValueChange?: (files: File[]) => void;
  maxFiles?: number;
  maxFileSize?: number;
}

const FileInput: React.FC<Props> = ({
  value = [],
  onValueChange,
  maxFiles,
  maxFileSize,
}) => {
  return (
    <div className="space-y-3">
      <FileDropZone
        onDrop={(accepted) => onValueChange?.([...value, ...accepted])}
        maxFileSize={maxFileSize}
        maxFiles={maxFiles}
      />
      {value.map((file, index) => (
        <FilePreview
          key={index}
          file={file}
          onDelete={() => onValueChange?.(value.filter((f, i) => i !== index))}
        />
      ))}
    </div>
  );
};

export default FileInput;
