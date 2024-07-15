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
  const adminUsers = await prisma.user.findMany({
    where: { isActive: true, isSuperUser: true },
  });
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
  const tasks = [
    sendMail({
      toEmail: propertyRequest.email,
      subject: "Property Request",
      text: clientMessage,
    }),
    ...adminUsers
      .filter(
        (user) =>
          config.contact.contactPeople.findIndex(
            (person) => person.email === user.email,
          ) !== -1,
      )
      .map((user) =>
        sendMail({
          toEmail: user.email,
          subject: "Property Request",
          text: parseMessage<{
            staff_name: string;
            client_name: string;
            property_title: string;
            client_phone: string;
            client_email: string;
            property_link: string;
          }>(
            {
              staff_name: user.name,
              client_name: propertyRequest.name,
              property_title: propertyRequest.property.title,
              client_phone: propertyRequest.phoneNumber,
              client_email: propertyRequest.email,
              property_link: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/properties/${propertyRequest.propertyId}`,
            },
            config.MESSAGE.REQUEST_PROPERTY_ADMIN,
          ),
        }),
      ),
    ...config.contact.contactPeople.map((person) =>
      sendMail({
        toEmail: person.email,
        subject: "Property Request",
        text: parseMessage<{
          staff_name: string;
          client_name: string;
          property_title: string;
          client_phone: string;
          client_email: string;
          property_link: string;
        }>(
          {
            staff_name: person.name,
            client_name: propertyRequest.name,
            property_title: propertyRequest.property.title,
            client_phone: propertyRequest.phoneNumber,
            client_email: propertyRequest.email,
            property_link: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/properties/${propertyRequest.propertyId}`,
          },
          config.MESSAGE.REQUEST_PROPERTY_ADMIN,
        ),
      }),
    ),
  ];
  const infor = await Promise.all(tasks);
  console.log(infor);
  return NextResponse.json(propertyRequest);
};
