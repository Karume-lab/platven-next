import { getExpiredCookieHeader, getSessionUser } from "@/lib/auth-utils";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const PUT = async (
  request: NextRequest,
  { params: { id } }: { params: { id: string } },
) => {
  const user = await getSessionUser();
  if (!user)
    return NextResponse.json(
      { detail: "Unauthorized" },
      { status: 401, headers: getExpiredCookieHeader(request) },
    );
  if (!user.isStaff&& !user.isSuperUser)
    return NextResponse.json(
      { detail: "You have no permision to perfom action" },
      { status: 403 },
    );

  if (
    !z.string().uuid().safeParse(id).success ||
    !(await prisma.property.findUnique({ where: { id } }))
  )
    return NextResponse.json(
      { detail: "Property not found!" },
      { status: 404 },
    );

  const contact = await prisma.property.update({
    where: { id },
    data: { isActive: true, rejectionReason: null },
  });
  return NextResponse.json(contact);
};
