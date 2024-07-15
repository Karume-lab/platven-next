import prisma from "@/prisma/client";
import { PropsWithPathParams } from "@/types";
import { notFound } from "next/navigation";
import React, { FC } from "react";
import Verifier from "./verifier";

const VerifyAccount: FC<PropsWithPathParams> = async ({
  params: { token },
}) => {
  const verification = await prisma.oTPVerificatiion.findUnique({
    where: {
      id: token,
      expiry: { gte: new Date(Date.now()) },
      verified: false,
      user: {
        accountVerified: false,
      },
    },
  });
  if (!verification) return notFound();
  return (
    <div>
      <Verifier token={token} />
      <div className="mt-10 flex justify-center">Verifying account ...</div>
    </div>
  );
};

export default VerifyAccount;
