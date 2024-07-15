import { changePasswordSchema } from "@/components/forms/auth/schema";
import {
  checkPassword,
  getExpiredCookieHeader,
  getSessionUser,
  hashPassword,
} from "@/lib/auth-utils";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user)
    return NextResponse.json(
      { detail: "Unauthorized" },
      { status: 401, headers: getExpiredCookieHeader(request) },
    );
  const data = await request.json();
  const validation = await changePasswordSchema.safeParseAsync(data);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });
  const { confirmNewPassword, currentPassword, newPassword } = validation.data;

  if (!(await checkPassword(user.password!, currentPassword)))
    return NextResponse.json(
      {
        currentPassword: { _errors: ["Incorect password"] },
      },
      { status: 400 },
    );

  const _user = await prisma.user.update({
    where: { id: user.id },
    data: { password: await hashPassword(newPassword) },
  });
  return NextResponse.json(
    { detail: "Password changed succesfully" },
    { headers: getExpiredCookieHeader(request) },
  );
}
