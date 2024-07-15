import ResetPasswordForm from "@/components/forms/auth/ResetPasswordForm";
import prisma from "@/prisma/client";
import { PropsWithPathParams } from "@/types";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FC } from "react";

const ResetPasswordPage: FC<PropsWithPathParams> = async ({
  params: { token },
}) => {
  const verification = await prisma.oTPVerificatiion.findUnique({
    where: {
      id: token,
      expiry: { gte: new Date(Date.now()) },
      verified: false,
    },
  });
  if (!verification) return notFound();

  return (
    <div>
      <div className="flex flex-col space-y-4 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email address where you will receive reset password link
        </p>
      </div>
      <ResetPasswordForm token={token} />
      <div className="flex pt-4 space-x-2 ">
        <Link href="/sign-in" className="underline opacity-50">
          Back to login
        </Link>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
