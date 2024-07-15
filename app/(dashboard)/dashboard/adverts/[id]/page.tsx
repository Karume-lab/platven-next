import BreadCrumb from "@/components/breadcrumb";
import AdvertForm from "@/components/forms/adverts/AdvertForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import prisma from "@/prisma/client";
import { PropsWithPathParams } from "@/types";
import { notFound } from "next/navigation";
import { FC } from "react";
const breadcrumbItems = [
  { title: "Adverts", link: "/dashboard/adverts" },
  { title: "Update", link: "/dashboard/adverts/update" },
];
const PropertyTypeUpdatePage: FC<PropsWithPathParams> = async ({
  params: { id },
}) => {
  const advert = await prisma.advert.findUnique({ where: { id } });
  if (!advert) return notFound();
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <AdvertForm advert={advert} />
      </div>
    </ScrollArea>
  );
};

export default PropertyTypeUpdatePage;
