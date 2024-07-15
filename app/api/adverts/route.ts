import { advertValidationSchema } from "@/components/forms/adverts/schema";
import { saveMediaFileName, strToBool } from "@/lib/auth-utils";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const GET = async (request: NextRequest) => {
  const adverts = await prisma.advert.findMany();
  return NextResponse.json(adverts);
};

export const POST = async (request: NextRequest) => {
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
  } else {
    return NextResponse.json(
      { image: { _errors: ["Image required"] } },
      { status: 400 },
    );
  }

  const advert = await prisma.advert.create({
    data: { ...validation.data, image },
  });
  return NextResponse.json(advert);
};
