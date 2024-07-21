import { propertyFormSchema } from "@/components/forms/properties/schema";
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

// export const GET = async (request: NextRequest) => {};

export const PUT = async (
  request: NextRequest,
  { params: { id } }: { params: { id: string } },
) => {
  const user = await getSessionUser();
  if (!user)
    return NextResponse.json(
      { detail: "Unauthorized" },
      { status: 401, headers: getExpiredCookieHeader(request) },
    );

  if (
    !z.string().uuid().safeParse(id).success ||
    !(await prisma.property.findUnique({
      where: {
        id,
        userId: user.isStaff || user.isSuperUser ? undefined : user.id,
      },
    }))
  )
    return NextResponse.json({ detail: "Property not found" }, { status: 404 });

  const formData = await request.formData();
  const data = Array.from(formData.entries()).reduce<any>(
    (prev, [key, value]) => {
      if (key === "images") return prev;
      return { ...prev, [key]: value };
    },
    {},
  );
  const validation = await propertyFormSchema.safeParseAsync({
    ...data,
    listed: strToBool(data.listed),
  });
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  let images;
  const imageFiles = formData.getAll("images") as File[];
  if (imageFiles.length > 0) {
    const paths = imageFiles.map((file) =>
      saveMediaFileName("properties", file.name ?? "", "jpeg"),
    );

    images = paths.map((path) => path.relativePath);
    const buffers = await Promise.all(
      imageFiles.map((file) => file.arrayBuffer()),
    );
    const asyncTasks = buffers.map((buffer, index) =>
      sharp(buffer)
        .toFormat("jpeg", { mozjpeg: true })
        .resize(800, 500, { fit: "cover" })
        .toFile(paths[index].absolutePath),
    );
    await Promise.all(asyncTasks);
  }
  //   TODO Properly file updates weather update or overried

  const properties = await prisma.property.update({
    where: { id: id },
    data: { ...validation.data, images },
  });
  return NextResponse.json(properties);
};

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
  if (
    !z.string().uuid().safeParse(id).success ||
    !(await prisma.property.findUnique({ where: { id, userId: user.id } }))
  )
    return NextResponse.json({ detail: "Property not found" }, { status: 404 });

  const propertyTypes = await prisma.property.delete({
    where: {
      id: id,
      userId: user.isStaff ? undefined : user.id,
    },
  });
  return NextResponse.json(propertyTypes);
};
