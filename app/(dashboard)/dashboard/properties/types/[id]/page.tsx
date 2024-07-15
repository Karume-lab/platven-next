import BreadCrumb from "@/components/breadcrumb";
import PropertyTypeForm from "@/components/forms/properties/property-type-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import prisma from "@/prisma/client";
import { PropsWithPathParams } from "@/types";
import { FC } from "react";
const breadcrumbItems = [
  { title: "Properties", link: "/dashboard/properties" },
  { title: "Types", link: "/dashboard/properties/types" },
];
const PropertyTypeUpdatePage: FC<PropsWithPathParams> = async ({
  params: { id },
}) => {
  const propertyType = await prisma.propertyType.findUnique({ where: { id } });

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <PropertyTypeForm propertyType={propertyType as any} />
      </div>
    </ScrollArea>
  );
};

export default PropertyTypeUpdatePage;
