import BreadCrumb from "@/components/breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import prisma from "@/prisma/client";
import { PropsWithPathParams } from "@/types";
import moment from "moment/moment";
import Image from "next/image";
import { FC } from "react";

const breadcrumbItems = [
  { title: "Users", link: "/dashboard/user" },
  { title: "Profile", link: "" },
];

const UserProfilePage: FC<PropsWithPathParams> = async ({ params: { id } }) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      properties: { include: { payment: true, requests: true, type: true } },
      team: true,
    },
  });
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 w-full lg:w-[50%]">
        <BreadCrumb items={breadcrumbItems} />
        <Separator />
        <div className="shadow-md p-3 flex flex-col space-y-3">
          <div className="flex flex-row space-x-4 mb-2">
            {/* <Image
              src={{
                src: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${user!.image}`,
                width: 100,
                height: 100,
              }}
              alt="profile pic"
              className="rounded-full w-28 h-28 "
            /> */}
            <img
              src={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/${user!.image}`}
              alt="profile pic"
              className="rounded-full w-28 h-28 "
            />
            <div className="flex flex-col justify-center space-y-2">
              <h1 className="text-xl font-bold">{user?.name ?? "-"}</h1>
              <p className="opacity-50">{user?.email}</p>
              {/* <p className="opacity-50">{user?.phoneNumber}</p>
              <p className="opacity-50">{`${user?.properties.length} properties`}</p> */}
            </div>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="font-bold">
                User Details
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 gap-3">
                  <div className="grid grid-cols-2">
                    <span>Name</span>
                    <span>{user?.name}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span>Email</span>
                    <span>{user?.email}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span>Phone number</span>
                    <span>{user?.phoneNumber}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span>Active status</span>
                    <span>{user?.isActive ? "Active" : "Inactive"}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span>Role</span>
                    <span>{user?.isStaff ? "Staff" : "Client"}</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="font-bold">
                Properties ({user?.properties.length})
              </AccordionTrigger>
              <AccordionContent className="space-y-2">
                {user?.properties.map(
                  (
                    {
                      title,
                      county,
                      subCounty,
                      createdAt,
                      features,
                      images,
                      listed,
                      requests,
                    },
                    index,
                  ) => (
                    <div key={index} className="flex space-x-4 relative">
                      {/* <Image
                        src={{
                          src: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${images[0]}`,
                          width: 800 / 5,
                          height: 500 / 5,
                        }}
                        className="w"
                        alt="title"
                      /> */}
                      <img
                        src={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/${images[0]}`}
                        className="w"
                        alt="title"
                      />
                      <div className="flex flex-col justify-center">
                        <div className="font-bold">{title}</div>
                        <div className="">
                          {county}, {subCounty}
                        </div>
                        <div className="">
                          {moment(createdAt).format("Do dd MMM yyy")}
                        </div>
                        <div className="">{`${requests.length} Requests`}</div>
                      </div>

                      <Badge className="absolute top-1 left-1 bg-accent text-primary">
                        {listed ? "Listed" : "Unlisted"}
                      </Badge>
                    </div>
                  ),
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </ScrollArea>
  );
};

export default UserProfilePage;
