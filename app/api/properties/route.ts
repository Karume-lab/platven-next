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

// export const GET = async (request: NextRequest) => {};

export const POST = async (request: NextRequest) => {
  const user = await getSessionUser();
  if (!user)
    return NextResponse.json(
      { detail: "Unauthorized" },
      { status: 401, headers: getExpiredCookieHeader(request) },
    );
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
  } else {
    return NextResponse.json(
      { images: { _errors: ["Atleast one image required"] } },
      { status: 400 },
    );
  }

  const properties = await prisma.property.create({
    data: {
      ...validation.data,
      images,
      userId: user!.id,
      isActive: user.isStaff || user.isSuperUser,
      payment:
        user.isStaff || user.isSuperUser
          ? {
              create: {
                amount: 0,
                complete: true,
                merchantRequestId: null,
                checkoutRequestId: null,
              },
            }
          : undefined,
    },
  });
  return NextResponse.json(properties);
};
