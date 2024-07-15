import { getSessionUser } from "@/lib/auth-utils";
import config from "@/lib/config";
import prisma from "@/prisma/client";
import { parseMessage } from "@/services";
import { sendMail } from "@/services/mail-service";
import moment from "moment/moment";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const user = await getSessionUser();

  if (!user)
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  if (user.accountVerified)
    return NextResponse.json({ detaile: "Account already verified" });
  // Validate otp
  let verification = await prisma.oTPVerificatiion.findFirst({
    where: {
      user: { email: user.email },
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

  // Send sign in email with otp
  const message = parseMessage<{
    user_name: string;
    verification_link: string;
  }>(
    {
      user_name: user.name ?? user.email,
      verification_link: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/verify/${verification.id}`,
    },
    config.MESSAGE.ACCOUNT_VERIFICATION,
  );

  await sendMail({
    toEmail: user.email,
    subject: "Account Verification",
    text: message,
  });

  return NextResponse.json({
    detail: "Verification link has been sent  to your email!",
  });
}
