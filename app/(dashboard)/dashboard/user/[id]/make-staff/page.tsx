import NotFound from "@/app/not-found";
import BreadCrumb from "@/components/breadcrumb";
import StaffForm from "@/components/forms/staff/staff-fom";
import { ScrollArea } from "@/components/ui/scroll-area";
import prisma from "@/prisma/client";
import { PropsWithPathParams } from "@/types";
import { notFound } from "next/navigation";
import { FC } from "react";

const breadcrumbItems = [
  { title: "User", link: "/dashboard/user" },
  { title: "Make Staff", link: "/" },
];
const MakeStaff: FC<PropsWithPathParams> = async ({ params: { id } }) => {
  const user = await prisma.user.findUnique({
    where: { id, isStaff: false, isSuperUser: false },
    include: { team: true },
  });
  if (!user) return notFound();
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <StaffForm user={user as any} createFromUser />
      </div>
    </ScrollArea>
  );
};

export default MakeStaff;
