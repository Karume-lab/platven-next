import BreadCrumb from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getSessionUser } from "@/lib/auth-utils";
import prisma from "@/prisma/client";
import { Plus } from "lucide-react";
import moment from "moment/moment";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import TypeCardControlls from "./type-card-controls";

const breadcrumbItems = [
  { title: "Properties", link: "/dashboard/properties" },
  { title: "Types", link: "/dashboard/properties/types" },
];
type Props = {};

const PropertiesTypes: FC<Props> = async ({}) => {
  const user = await getSessionUser();
  const propertiesTypes = await prisma.propertyType.findMany({
    include: { properties: true },
  });
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex flex-col lg:flex-row lg:justify-between shadow-md p-4 lg:items-center space-y-3 lg:space-x-3 ">
          <div className="w-full lg:w-[400px]">
            <Input placeholder="Search ..." />
          </div>
          <Button className="w-full lg:w-[200px]">
            <Link
              href={"/dashboard/properties/types/add"}
              className="flex space-x-3 items-center"
            >
              <Plus />
              Add Property Type
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {propertiesTypes.map((type_) => {
            const { id, isActive, icon, createdAt, title, updatedAt } = type_;
            return (
              <div
                key={id}
                className="shadow-lg flex space-x-4 relative rounded-sm overflow-hidden bg-accent"
              >
                {/* <Image
                  src={{
                    src: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${icon}`,
                    width: 100,
                    height: 100,
                  }}
                  className="w-28 h-28"
                  alt={title}
                /> */}
                <img
                  src={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/${icon}`}
                  className="w-28 h-28"
                  alt={title}
                />
                <div className="flex flex-col py-4">
                  <h1 className="font-bold text-xl">{title}</h1>
                  <p className="">{isActive ? "Active" : "Inactive"}</p>
                  <p className="">
                    {moment(createdAt).format("Do dd MMM yyy")}
                  </p>
                </div>
                <TypeCardControlls type={type_} />
              </div>
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );
};

export default PropertiesTypes;
