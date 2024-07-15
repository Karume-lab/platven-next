import { advertValidationSchema } from "@/components/forms/adverts/schema";
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
  if (!user.isStaff && !user.isSuperUser)
    return NextResponse.json(
      { detail: "You have no permision to delete advert" },
      { status: 403 },
    );
  if (
    !z.string().uuid().safeParse(id).success ||
    !(await prisma.advert.findUnique({ where: { id } }))
  )
    return NextResponse.json({ detail: "Advert not found" }, { status: 404 });

  const advert = await prisma.advert.delete({
    where: { id: id as string },
  });
  return NextResponse.json(advert);
};
export const PUT = async (
  request: NextRequest,
  { params: { id } }: { params: { id: string } },
) => {
  if (
    !z.string().uuid().safeParse(id).success ||
    !(await prisma.advert.findUnique({ where: { id } }))
  )
    return NextResponse.json({ detail: "Advert not found" }, { status: 404 });

  const formData = await request.formData();
  const data = Array.from(formData.entries()).reduce<any>(
    (prev, [key, value]) => {
      if (key === "image") return prev;
      return { ...prev, [key]: value };
    },
    {},
  );

  const validation = await advertValidationSchema.safeParseAsync({
    ...data,
  });
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  let image;
  const imageFile = formData.get("image");
  if (imageFile) {
    const { absolutePath, relativePath } = saveMediaFileName(
      "adverts",
      (imageFile as File).name ?? "",
      "jpeg",
    );
    image = relativePath;
    await sharp(await (imageFile as File).arrayBuffer())
      .toFormat("jpeg", { mozjpeg: true })
      .resize(2000, 1333, { fit: "cover" })
      .toFile(absolutePath);
  }

  const advert = await prisma.advert.update({
    where: { id },
    data: { ...validation.data, image },
  });
  return NextResponse.json(advert);
};
