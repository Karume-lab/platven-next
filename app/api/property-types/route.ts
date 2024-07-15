import { propertyTypeSchema } from "@/components/forms/properties/schema";
import { saveMediaFileName, strToBool } from "@/lib/auth-utils";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const GET = async (request: NextRequest) => {
  const propertyTypes = await prisma.propertyType.findMany({
    where: { isActive: true },
  });
  return NextResponse.json(propertyTypes);
};

export const POST = async (request: NextRequest) => {
  const formData = await request.formData();
  const data = Array.from(formData.entries()).reduce<any>(
    (prev, [key, value]) => {
      if (key === "icon") return prev;
      return { ...prev, [key]: value };
    },
    {},
  );

  const validation = await propertyTypeSchema.safeParseAsync({
    ...data,
    isActive: strToBool(data.isActive),
  });
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });
  let image;
  const imageFile = formData.get("icon");
  if (imageFile) {
    const { absolutePath, relativePath } = saveMediaFileName(
      "property-types",
      (imageFile as File).name ?? "",
      "jpeg",
    );
    image = relativePath;
    await sharp(await (imageFile as File).arrayBuffer())
      .toFormat("jpeg", { mozjpeg: true })
      .resize(800, 800, { fit: "cover" })
      .toFile(absolutePath);
  } else {
    return NextResponse.json(
      { icon: { _errors: ["Icon required"] } },
      { status: 400 },
    );
  }

  const propertyType = await prisma.propertyType.create({
    data: { ...validation.data, icon: image },
  });
  return NextResponse.json(propertyType);
};
