import { requestSetPasswordSchema } from "@/components/forms/auth/schema";
import config from "@/lib/config";
import prisma from "@/prisma/client";
import { parseMessage } from "@/services";
import { sendMail } from "@/services/mail-service";
import moment from "moment/moment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const validation = await requestSetPasswordSchema.safeParseAsync(data);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });
  const { email } = validation.data;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user)
    return NextResponse.json(
      {
        email: { _errors: ["No account with such email"] },
      },
      { status: 400 },
    );
  let verification = await prisma.oTPVerificatiion.findFirst({
    where: {
      user: { email },
      expiry: { gte: new Date(Date.now()) },
      verified: false,
    },
  });
  if (!verification)
    verification = await prisma.oTPVerificatiion.create({
      data: {
        userId: user.id,
        expiry: moment().add(2, "hours").toDate(),
      },
    });
  const message = parseMessage<{ name: string; reset_password_link: string }>(
    {
      name: user.name ?? email,
      reset_password_link: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/reset-password/${verification.id}`,
    },
    config.MESSAGE.RESET_PASSWORD,
  );
  await sendMail({ toEmail: email, subject: "Password Reset", text: message });
  return NextResponse.json({
    detail: "Password reset link sent to your email",
  });
}
