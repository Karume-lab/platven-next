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

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { notFound } from "next/navigation";
import AdvertCardControlls from "./adverts-card-controls";

const breadcrumbItems = [{ title: "Adverts", link: "/dashboard/adverts" }];

const Adverts = async () => {
  const user = await getSessionUser();
  if (!user?.isSuperUser && user?.isStaff) return notFound();
  const adverts = await prisma.advert.findMany();
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
              href={"/dashboard/adverts/add"}
              className="flex space-x-3 items-center"
            >
              <Plus />
              Add Adverts
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {adverts.map((type_) => {
            const { id, createdAt, title, updatedAt, description, image } =
              type_;
            return (
              <div
                key={id}
                className="shadow-lg space-y-4 relative rounded-sm overflow-hidden bg-accent"
              >
                {/* <Image
                  src={{
                    src: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${image}`,
                    width: 100,
                    height: 100,
                  }}
                  alt={title}
                /> */}
                <img
                  src={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/${image}`}
                  className="w-full h-72"
                  alt={title}
                />
                <div className="flex flex-col p-4">
                  <h1 className="font-bold text-xl">{title}</h1>
                  {/* <p className="">{isActive ? "Active" : "Inactive"}</p> */}
                  <p className="">
                    {moment(createdAt).format("Do dd MMM yyy")}
                  </p>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Description</AccordionTrigger>
                      <AccordionContent>{description}</AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                <AdvertCardControlls advert={type_} />
              </div>
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );
};

export default Adverts;
