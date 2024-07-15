import { resetPasswordSchema } from "@/components/forms/auth/schema";
import { hashPassword } from "@/lib/auth-utils";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params: { token } }: { params: { token: string } },
) {
  const verification = await prisma.oTPVerificatiion.findUnique({
    where: {
      id: token,
      expiry: { gte: new Date(Date.now()) },
      verified: false,
    },
  });
  if (!verification)
    return NextResponse.json(
      { detail: "Invalid or Expired token!" },
      { status: 404 },
    );
  const data = await request.json();
  const valudation = await resetPasswordSchema.safeParseAsync(data);
  if (!valudation.success)
    return NextResponse.json(valudation.error.format(), { status: 400 });

  const user = await prisma.user.update({
    where: { id: verification.userId },
    data: {
      password: await hashPassword(valudation.data.newPassword),
      OTPVerificatiions: {
        update: {
          where: { id: token },
          data: { verified: true },
        },
      },
    },
  });

  return NextResponse.json({ detail: "Password Reset successfully" });
}
