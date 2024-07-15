import { landFormSchema } from "@/components/forms/properties/schema";
import {
  getExpiredCookieHeader,
  getSessionUser,
  saveMediaFileName,
  strToBool,
} from "@/lib/auth-utils";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

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

  // Validate form data using schema
  const validation = await landFormSchema.safeParseAsync({
    ...data,
    listed: strToBool(data.listed),
  });

  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  let images;
  const imageFiles = formData.getAll("images") as File[];

  if (imageFiles.length === 0) {
    return NextResponse.json(
      { images: { _errors: ["At least one image required"] } },
      { status: 400 },
    );
  }

  try {
    // Process and save images
    const paths = imageFiles.map((file) =>
      saveMediaFileName("properties", file.name ?? "", "jpeg"),
    );

    images = paths.map((path) => path.relativePath);
    const buffers = await Promise.all(
      imageFiles.map((file) => file.arrayBuffer()),
    );

    // Resize and convert images using sharp
    const asyncTasks = buffers.map((buffer, index) =>
      sharp(buffer)
        .toFormat("jpeg", { mozjpeg: true })
        .resize(800, 500, { fit: "cover" })
        .toFile(paths[index].absolutePath),
    );

    await Promise.all(asyncTasks);
  } catch (error) {
    console.error("Error processing images:", error);
    return NextResponse.json(
      { images: { _errors: ["Error processing images"] } },
      { status: 500 },
    );
  }

  // Create property using Prisma
  try {
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
        typeId: validation.data.typeId!,
      },
    });

    return NextResponse.json(properties);
  } catch (error) {
    console.error("Error creating property:", error);
    return NextResponse.json(
      { detail: "Error creating property" },
      { status: 500 },
    );
  }
};
