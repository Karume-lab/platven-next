import { resetPasswordSchema } from "@/components/forms/auth/schema";
import { authCookieConfig } from "@/constants";
import { generateUserToken, hashPassword } from "@/lib/auth-utils";
import prisma from "@/prisma/client";
import { serialize } from "cookie";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params: { token } }: { params: { token: string } },
) {
  // Validate otp
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
  // Update Account to verified
  const user = await prisma.user.update({
    where: { id: verification.userId },
    data: {
      accountVerified: true,
      OTPVerificatiions: {
        update: {
          where: {
            id: token,
          },
          data: { verified: true },
        },
      },
    },
  });

  // 1. Generate token
  const authToken = generateUserToken(user);
  // configur cookie
  const serializedCookieToken = serialize(
    authCookieConfig.name,
    authToken ?? "",
    authCookieConfig.config,
  );
  const headers = new Headers();
  headers.append("Set-Cookie", serializedCookieToken);
  return NextResponse.json(
    { detail: "Account verified succesfully" },
    { headers },
  );
}
