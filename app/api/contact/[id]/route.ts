import { contactFormSchema } from "@/components/forms/contact/schema";
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
  if (!user.isStaff && !user.isSuperUser)
    return NextResponse.json(
      { detail: "You have no permision to delete message" },
      { status: 403 },
    );
  if (
    !z.string().uuid().safeParse(id).success ||
    !(await prisma.contact.findUnique({ where: { id } }))
  )
    return NextResponse.json({ detail: "Contact not found!" }, { status: 404 });
  const data = await request.json();
  const validation = await contactFormSchema.safeParseAsync(data);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });
  console.log(validation.data);

  const contact = await prisma.contact.update({
    where: { id },
    data: {
      ...validation.data,
      phoneNumber: String(validation.data.phoneNumber),
    },
  });
  return NextResponse.json(contact);
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
      { detail: "You have no permision to delete message" },
      { status: 403 },
    );
  if (
    !z.string().uuid().safeParse(id).success ||
    !(await prisma.contact.findUnique({ where: { id } }))
  )
    return NextResponse.json({ detail: "message not found" }, { status: 404 });

  const propertyTypes = await prisma.contact.delete({
    where: { id: id as string },
  });
  return NextResponse.json(propertyTypes);
};
