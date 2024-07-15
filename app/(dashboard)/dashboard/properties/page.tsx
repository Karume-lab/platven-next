import BreadCrumb from "@/components/breadcrumb";
import PropertyTable from "@/components/tables/properties-table/property-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { getSessionUser } from "@/lib/auth-utils";
import prisma from "@/prisma/client";
import { PropsWithSearchParams } from "@/types";
import { FC } from "react";

const breadcrumbItems = [
  { title: "Properties", link: "/dashboard/properties" },
];

const Properties: FC<PropsWithSearchParams> = async ({ searchParams }) => {
  const user = await getSessionUser();
  const properties = await prisma.property.findMany({
    where: {
      userId: user?.isStaff || user?.isSuperUser ? undefined : user?.id,
      OR: [
        { title: { contains: searchParams?.search, mode: "insensitive" } },
        { county: { contains: searchParams?.search, mode: "insensitive" } },

        {
          subCounty: {
            contains: searchParams?.search,
            mode: "insensitive",
          },
        },
        {
          features: { contains: searchParams?.search, mode: "insensitive" },
        },
        {
          rejectionReason: {
            contains: searchParams?.search,
            mode: "insensitive",
          },
        },
        {
          type: {
            title: { contains: searchParams?.search, mode: "insensitive" },
          },
        },
      ],
    },
    include: { type: true, requests: true, user: true, payment: true },
  });
  return (
    <div className="flex flex-col space-y-4  p-4 md:p-8 pt-6  h-full">
      <BreadCrumb items={breadcrumbItems} />
      <div className="flex items-start justify-between">
        <Heading
          title={`Properties (${properties.length})`}
          description="Manage Properties"
        />
      </div>
      <Separator />
      <PropertyTable properties={JSON.parse(JSON.stringify(properties))} />
    </div>
  );
};

export default Properties;
