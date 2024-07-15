import { registerSchema } from "@/components/forms/auth/schema";
import { authCookieConfig } from "@/constants";
import { generateUserToken, hashPassword } from "@/lib/auth-utils";
import config from "@/lib/config";
import prisma from "@/prisma/client";
import { parseMessage } from "@/services";
import { sendMail } from "@/services/mail-service";
import { serialize } from "cookie";
import { isEmpty } from "lodash";
import moment from "moment/moment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const validation = await registerSchema.safeParseAsync(await request.json());
  //   Validate with zode
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });
  const { email, password, phoneNumber, identificationNumber, name, type } =
    validation.data;
  const errors: any = {};
  let user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (user) errors["email"] = { _errors: ["User with email exist"] };
  user = await prisma.user.findUnique({
    where: {
      phoneNumber: String(phoneNumber),
    },
  });
  if (user)
    errors["phoneNumber"] = { _errors: ["User with phone number exist"] };
  user = await prisma.user.findUnique({
    where: {
      identificationNumber,
    },
  });
  if (user)
    errors["identificationNumber"] = { _errors: ["User with ID number exist"] };
  //   Check password
  if (!isEmpty(errors)) return NextResponse.json(errors, { status: 400 });

  user = await prisma.user.create({
    data: {
      email,
      phoneNumber: String(phoneNumber),
      type,
      identificationNumber,
      name,
      password: await hashPassword(password),
    },
  });

  // If success
  // generate otp

  const verification = await prisma.oTPVerificatiion.create({
    data: {
      userId: user.id,
      expiry: moment().add(2, "hours").toDate(),
    },
  });

  // Send sign in email with otp
  const message = parseMessage<{
    user_name: string;
    verification_link: string;
  }>(
    {
      user_name: user.name ?? email,
      verification_link: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/verify/${verification.id}`,
    },
    config.MESSAGE.ACCOUNT_VERIFICATION,
  );

  await sendMail({
    toEmail: email,
    subject: "Account Verification",
    text: message,
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
  return NextResponse.json(user, { headers });
}
