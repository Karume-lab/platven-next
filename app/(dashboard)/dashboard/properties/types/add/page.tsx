import BreadCrumb from "@/components/breadcrumb";
import PropertyTypeForm from "@/components/forms/properties/property-type-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { FC } from "react";

type Props = {};

const breadcrumbItems = [
  { title: "Properties", link: "/dashboard/properties" },
  { title: "Types", link: "/dashboard/properties/types" },
  { title: "Add", link: "/dashboard/properties/types/add" },
];
const PropertyTypeAddPage: FC<Props> = ({}) => {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <PropertyTypeForm />
      </div>
    </ScrollArea>
  );
};

export default PropertyTypeAddPage;
