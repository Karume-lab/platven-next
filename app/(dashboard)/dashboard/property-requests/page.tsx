import BreadCrumb from "@/components/breadcrumb";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import prisma from "@/prisma/client";
import { PropsWithSearchParams } from "@/types";
import { FC } from "react";

import PropertyRequestTable from "@/components/tables/property-requests/property-request-table";
import { getSessionUser } from "@/lib/auth-utils";
import { notFound } from "next/navigation";

const breadcrumbItems = [
  { title: "Properties", link: "/dashboard/properties" },
  { title: "Requests", link: "/dashboard/properties/add" },
];
const PropertyRequestsPage: FC<PropsWithSearchParams> = async ({
  searchParams,
}) => {
  const user = await getSessionUser();

  if (!user?.isStaff && !user?.isSuperUser) return notFound();

  const propertyRequest = await prisma.propertyRequest.findMany({
    where: {
      OR: [
        { message: { contains: searchParams?.search, mode: "insensitive" } },
        { name: { contains: searchParams?.search, mode: "insensitive" } },

        {
          email: {
            contains: searchParams?.search,
            mode: "insensitive",
          },
        },
        {
          phoneNumber: { contains: searchParams?.search, mode: "insensitive" },
        },
        {
          property: {
            title: { contains: searchParams?.search, mode: "insensitive" },
          },
        },
      ],
    },
    include: { property: true },
    orderBy: {
      isAddressed: "asc",
    },
  });
  return (
    <div className="flex flex-col space-y-4  p-4 md:p-8 pt-6  h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <Heading title="Property request" description="" />
        <Separator />
        <PropertyRequestTable messages={propertyRequest} />
      </div>
    </div>
  );
};

export default PropertyRequestsPage;
