"use client";
import clsx from "clsx";
import { Upload } from "lucide-react";
import React from "react";
import Dropzone, { FileRejection } from "react-dropzone";

interface Props {
  onDrop?: (acceptedFiles: File[], fileRejection: FileRejection[]) => void;
  maxFileSize?: number;
  maxFiles?: number;
}
// max file size is 20 mb

const FileDropZone: React.FC<Props> = ({
  onDrop,
  maxFileSize = 20971520,
  maxFiles = 10,
}) => {
  return (
    <Dropzone
      onDrop={onDrop}
      minSize={0}
      maxSize={maxFileSize}
      maxFiles={maxFiles}
    >
      {({
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
      }) => (
        <section
          className={clsx(
            "border-dashed border-2 rounded-lg justify-center items-center",
            {
              "dark:bg-slate-900 bg-slate-100": isDragActive && !isDragReject,
              "bg-red-900 text-white ": isDragReject,
            }
          )}
        >
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <div className="flex flex-col items-center p-8">
              <Upload className="font-bold" />
              <p className={clsx("text-center font-bold", {})}>
                {!isDragActive && "Click here or drop file to upload"}
                {isDragActive && !isDragReject && "Drop to upload ths file"}
                {isDragReject &&
                  "File type not accepted or max files accepteble exidded"}
              </p>
            </div>
          </div>
        </section>
      )}
    </Dropzone>
  );
};

export default FileDropZone;
