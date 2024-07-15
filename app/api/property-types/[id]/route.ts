import { propertyTypeSchema } from "@/components/forms/properties/schema";
import {
  getExpiredCookieHeader,
  getSessionUser,
  saveMediaFileName,
  strToBool,
} from "@/lib/auth-utils";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { z } from "zod";

export const DELETE = async (
  request: NextRequest,
  { params: { id } }: { params: { id: string } },
) => {
  const user = await getSessionUser();
  if (!user)
    return NextResponse.json(
      { detail: "Unauthorized" },
      { status: 401, headers: getExpiredCookieHeader(request) },
    );
  if (!user.isStaff&& !user.isSuperUser)
    return NextResponse.json(
      { detail: "You have no permision to delete property type" },
      { status: 403 },
    );
  if (
    !z.string().uuid().safeParse(id).success ||
    !(await prisma.propertyType.findUnique({ where: { id } }))
  )
    return NextResponse.json(
      { detail: "Property type not found" },
      { status: 404 },
    );

  const propertyTypes = await prisma.propertyType.delete({
    where: { id: id as string },
  });
  return NextResponse.json(propertyTypes);
};
export const PUT = async (
  request: NextRequest,
  { params: { id } }: { params: { id: string } },
) => {
  if (
    !z.string().uuid().safeParse(id).success ||
    !(await prisma.propertyType.findUnique({ where: { id } }))
  )
    return NextResponse.json(
      { detail: "Property type not found" },
      { status: 404 },
    );

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
  console.log(validation.data);

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
  }

  const propertyType = await prisma.propertyType.update({
    where: { id },
    data: { ...validation.data, icon: image },
  });
  return NextResponse.json(propertyType);
};
