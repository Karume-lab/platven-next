import { userProfileSchema } from "@/components/forms/profile/schema";
import { authCookieConfig } from "@/constants";
import { getExpiredCookieHeader, saveMediaFileName } from "@/lib/auth-utils";
import prisma from "@/prisma/client";
import { JsonWebTokenError, TokenExpiredError, verify } from "jsonwebtoken";
import { isEmpty } from "lodash";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const GET = async (request: NextRequest) => {
  const token = request.cookies.get(authCookieConfig.name)?.value;

  if (!token) {
    const response = NextResponse.json(
      { detail: "Unauthorized - Token missing" },
      { headers: getExpiredCookieHeader(request), status: 401 },
    );
    return response;
  }
  try {
    const { id }: any = verify(
      token as string,
      process.env.NEXTAUTH_SECRET as string,
    );
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw Error("");
    return NextResponse.json(user);
  } catch (error) {
    let detail;
    if (error instanceof TokenExpiredError) {
      detail = "Unauthorized - Token expired";
    } else if (error instanceof JsonWebTokenError) {
      detail = "Unauthorized - Invalid Token";
    } else {
      detail = "Unauthorized - Invalid Token";
    }
    return NextResponse.json(
      { detail },
      { status: 401, headers: getExpiredCookieHeader(request) },
    );
  }
};

export const POST = async (request: NextRequest) => {
  const token = request.cookies.get(authCookieConfig.name)?.value;

  if (!token) {
    const response = NextResponse.json(
      { detail: "Unauthorized - Token missing" },
      { headers: getExpiredCookieHeader(request), status: 401 },
    );
    return response;
  }
  try {
    const { id }: any = verify(
      token as string,
      process.env.NEXTAUTH_SECRET as string,
    );
    const user_ = await prisma.user.findUnique({ where: { id } });
    if (!user_) redirect("/sign-in");
    const formData = await request.formData();
    const data = Array.from(formData.entries()).reduce<any>(
      (prev, [key, value]) => {
        if (key === "image") return prev;
        return { ...prev, [key]: value };
      },
      {},
    );

    const validation = await userProfileSchema.safeParseAsync(data);
    if (!validation.success)
      return NextResponse.json(validation.error.format(), { status: 400 });

    let _user;
    let errors: any = {};

    _user = await prisma.user.findFirst({
      where: { email: validation.data.email, id: { not: user_.id } },
    });
    if (_user) errors["email"] = { _errors: ["User with email exists"] };
    _user = await prisma.user.findFirst({
      where: {
        phoneNumber: String(validation.data.phoneNumber),
        id: { not: user_.id },
      },
    });
    if (_user)
      errors["phoneNumber"] = { _errors: ["User with phoneNumber exists"] };
    _user = await prisma.user.findFirst({
      where: {
        identificationNumber: validation.data.identificationNumber,
        id: { not: user_.id },
      },
    });
    if (_user)
      errors["identificationNumber"] = { _errors: ["User with number exists"] };

    if (!isEmpty(errors)) return NextResponse.json(errors, { status: 400 });

    let image;
    const imageFile = formData.get("image");
    if (imageFile) {
      const { absolutePath, relativePath } = saveMediaFileName(
        "avatar",
        (imageFile as File).name ?? "",
        "jpeg",
      );
      image = relativePath;
      await sharp(await (imageFile as File).arrayBuffer())
        .toFormat("jpeg", { mozjpeg: true })
        .resize(400, 400, { fit: "cover" })
        .toFile(absolutePath);
    }

    const user = await prisma.user.update({
      where: { id },
      data: { ...validation.data, image, phoneNumber: String(validation.data.phoneNumber) },
    });
    return NextResponse.json(user);
  } catch (error) {
    let detail;
    if (error instanceof TokenExpiredError) {
      detail = "Unauthorized - Token expired";
    } else if (error instanceof JsonWebTokenError) {
      detail = "Unauthorized - Invalid Token";
    } else {
      detail = "Unauthorized - Invalid Token";
    }
    return NextResponse.json(
      { detail },
      { status: 401, headers: getExpiredCookieHeader(request) },
    );
  }
};
