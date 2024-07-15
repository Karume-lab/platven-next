import { z } from "zod";

const imageSchema = z.object({
  src: z.string(),
  type: z.string(),
  origin: z.enum(["remote", "local"]),
  name: z.string().optional(),
});

export const image = () => imageSchema;

type _FormFile = z.infer<typeof imageSchema>;

export class FormFile {
  // Include properties from _FormFile
  src: _FormFile["src"];
  type: _FormFile["type"];
  origin: _FormFile["origin"];
  name: _FormFile["name"];

  // Constructor to initialize properties
  constructor(data: _FormFile) {
    this.src = data.src;
    this.type = data.type;
    this.origin = data.origin;
    this.name = data.name;
  }

  // Static method to create FormFile instance from a file
  static async fromFile(file: File): Promise<FormFile> {
    if (!file || !file.size) {
      throw new Error("Invalid file or empty file provided");
    }
    return new Promise<FormFile>((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onerror = () => reject(new Error("Could not read file"));
      fileReader.onabort = () =>
        reject(new Error("Error reading file, read aborted"));
      fileReader.onload = () =>
        resolve(
          new FormFile({
            origin: "local",
            src: fileReader.result as string,
            type: file.type,
            name: file.name,
          }),
        );

      fileReader.readAsDataURL(file);
    });
  }

  size() {
    return this.origin === "local" ? this.src.length : 0;
  }

  // Method to create File from base64 data
  async toFile(): Promise<File> {
    if (this.origin !== "local") {
      throw new Error("Cannot convert a non-local file to File object");
    }

    const [, base64Data] = this.src.split(",");
    const binaryString = atob(base64Data);

    const uint8Array = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([uint8Array], { type: this.type });
    const file = new File([blob], this.name || "file", { type: blob.type });
    return file;
  }
}

export const fileExtensionsColors: { [key: string]: string } = {
  // Images
  jpg: "#ff4081",
  jpeg: "#ff4081",
  png: "#ff4081",
  gif: "#ff4081",
  bmp: "#ff4081",
  svg: "#ff4081",
  tiff: "#ff4081",

  // Documents
  doc: "#4285f4",
  docx: "#4285f4",
  odt: "#4285f4",
  pdf: "#4285f4",
  xls: "#4285f4",
  xlsx: "#4285f4",
  ppt: "#4285f4",
  pptx: "#4285f4",
  txt: "#4285f4",

  // Audio
  mp3: "#03a9f4",
  ogg: "#03a9f4",
  wav: "#03a9f4",

  // Video
  mp4: "#ff5722",
  avi: "#ff5722",
  mkv: "#ff5722",
  mov: "#ff5722",

  // Code
  js: "#8bc34a",
  jsx: "#8bc34a",
  css: "#8bc34a",
  html: "#8bc34a",
  php: "#8bc34a",
  py: "#8bc34a",
  json: "#8bc34a",

  // Archive
  zip: "#e91e63",
  tar: "#e91e63",
  rar: "#e91e63",

  // Other
  xml: "#607d8b",
  sql: "#607d8b",
  exe: "#607d8b",
  default: "#9e9e9e", // Default color for unknown file types
};
