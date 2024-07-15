import { propertyRequestFormSchema } from "@/components/forms/properties/schema";
import { getExpiredCookieHeader, getSessionUser } from "@/lib/auth-utils";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
// TODO LIMIT ALL EDITS TO STAFFS ONLY
export const PUT = async (
  request: NextRequest,
  { params: { id } }: { params: { id: string } },
) => {
  if (
    !z.string().uuid().safeParse(id).success ||
    !(await prisma.propertyRequest.findUnique({ where: { id } }))
  )
    return NextResponse.json(
      { detail: "Property Request not found" },
      { status: 404 },
    );
  const data = await request.json();
  const validation = await propertyRequestFormSchema.safeParseAsync(data);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  const propRequest = await prisma.propertyRequest.update({
    where: { id },
    data: {
      ...validation.data,
      phoneNumber: String(validation.data.phoneNumber),
    },
  });
  return NextResponse.json(propRequest);
};

export const DELETE = async (
  request: NextRequest,
  { params: { id } }: { params: { id: string } },
) => {
  const user = await getSessionUser();
  if (!user)
    return NextResponse.json(
      { detail: "Unauthorized" },
      { status: 401, headers: getExpiredCookieHeader(request) },
    );
  if (!user.isStaff && !user.isSuperUser)
    return NextResponse.json(
      { detail: "You have no permision to delete property request" },
      { status: 403 },
    );
  if (
    !z.string().uuid().safeParse(id).success ||
    !(await prisma.propertyRequest.findUnique({ where: { id } }))
  )
    return NextResponse.json(
      { detail: "Property request not found" },
      { status: 404 },
    );

  const propertyTypes = await prisma.propertyRequest.delete({
    where: { id: id as string },
  });
  return NextResponse.json(propertyTypes);
};
