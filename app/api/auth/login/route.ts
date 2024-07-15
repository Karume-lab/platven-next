import { loginSchema } from "@/components/forms/auth/schema";
import { authCookieConfig } from "@/constants";
import { checkPassword, generateUserToken } from "@/lib/auth-utils";
import prisma from "@/prisma/client";
import { serialize } from "cookie";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const validation = await loginSchema.safeParseAsync(await request.json());
  //   Validate with zode
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });
  const user = await prisma.user.findUnique({
    where: { email: validation.data.email, isActive: true },

  });
  //   Check password
  if (
    !user ||
    !(await checkPassword(user!.password!, validation.data.password))
  )
    return NextResponse.json(
      {
        email: { _errors: ["Invalid email or password"] },
        password: { _errors: ["Invalid email or password"] },
      },
      { status: 400 },
    );

  // If success
  // 1. Generate token
  const token = generateUserToken(user);
  // configur cookie
  const serializedCookieToken = serialize(
    authCookieConfig.name,
    token ?? "",
    authCookieConfig.config,
  );
  const headers = new Headers();
  headers.append("Set-Cookie", serializedCookieToken);
  return NextResponse.json(user, { headers });
}
