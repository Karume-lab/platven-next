import BreadCrumb from "@/components/breadcrumb";
import MessagesTable from "@/components/tables/messages/messages-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { getSessionUser } from "@/lib/auth-utils";
import prisma from "@/prisma/client";
import { PropsWithSearchParams } from "@/types";
import { notFound } from "next/navigation";
import { FC } from "react";
const breadcrumbItems = [{ title: "Messages", link: "/dashboard/contact" }];

const Contact: FC<PropsWithSearchParams> = async ({ searchParams }) => {
  const user = await getSessionUser();

  if (!user?.isSuperUser) return notFound();

  const contacts = await prisma.contact.findMany({
    where: {
      AND: [
        {
          OR: [
            { email: { contains: searchParams?.search, mode: "insensitive" } },

            {
              phoneNumber: {
                contains: searchParams?.search,
                mode: "insensitive",
              },
            },
            {
              message: { contains: searchParams?.search, mode: "insensitive" },
            },
            { name: { contains: searchParams?.search, mode: "insensitive" } },
            {
              subject: { contains: searchParams?.search, mode: "insensitive" },
            },
          ],
        },
      ],
    },
    orderBy: {
      isAddressed: "asc",
    },
  });
  return (
    <div className="flex flex-col space-y-4  p-4 md:p-8 pt-6  h-full">
      <BreadCrumb items={breadcrumbItems} />
      <div className="flex items-start justify-between">
        <Heading
          title={`Messages (${contacts.length})`}
          description="Manage Messages"
        />
      </div>
      <Separator />
      <Heading title="Messages" description="" />
      <MessagesTable messages={contacts} />
    </div>
  );
};

export default Contact;
