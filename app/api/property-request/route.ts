import { propertyRequestFormSchema } from "@/components/forms/properties/schema";
import config from "@/lib/config";
import prisma from "@/prisma/client";
import { parseMessage } from "@/services";
import { sendMail } from "@/services/mail-service";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const data = await request.json();
  const validation = await propertyRequestFormSchema.safeParseAsync(data);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  //   Ensure property exist
  if (
    !(await prisma.property.findUnique({
      where: { id: validation.data.propertyId },
    }))
  )
    return NextResponse.json(
      { propertyId: { _errors: ["Invalid property"] } },
      { status: 400 },
    );
  const propertyRequest = await prisma.propertyRequest.create({
    data: {
      ...validation.data,
      phoneNumber: String(validation.data.phoneNumber),
    },
    include: { property: true },
  });
  const clientMessage = parseMessage<{
    client_name: string;
    property_title: string;
  }>(
    {
      client_name: propertyRequest.name,
      property_title: propertyRequest.property.title,
    },
    config.MESSAGE.REQUEST_PROPERTY_CLIENT,
  );
  const adminMessage = parseMessage<{
    staff_name: string;
    client_name: string;
    property_title: string;
    client_phone: string;
    client_email: string;
    property_link: string;
  }>(
    {
      staff_name: "Jeff Odhiambo",
      client_name: propertyRequest.name,
      property_title: propertyRequest.property.title,
      client_phone: propertyRequest.phoneNumber,
      client_email: propertyRequest.email,
      property_link: `http://localhost:3000/properties/${propertyRequest.propertyId}`,
    },
    config.MESSAGE.REQUEST_PROPERTY_ADMIN,
  );
  const tasks = [
    sendMail({
      toEmail: propertyRequest.email,
      subject: "Property Request",
      text: clientMessage,
    }),
    sendMail({
      toEmail: "o.jeff3.a@gmail.com",
      subject: "Property Request",
      text: adminMessage,
    }),
  ];
  const infor = await Promise.all(tasks);
  console.log(infor);
  return NextResponse.json(propertyRequest);
};
