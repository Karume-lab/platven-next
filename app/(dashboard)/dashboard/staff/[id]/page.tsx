import BreadCrumb from "@/components/breadcrumb";
import StaffForm from "@/components/forms/staff/staff-fom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getSessionUser } from "@/lib/auth-utils";
import prisma from "@/prisma/client";
import { PropsWithPathParams } from "@/types";
import { notFound } from "next/navigation";
import { FC } from "react";

const breadcrumbItems = [
  { title: "User", link: "/dashboard/user" },
  { title: "Update", link: "/dashboard/user/create" },
];
const UpdateStaffPage: FC<PropsWithPathParams> = async ({ params: { id } }) => {
  const _user = await getSessionUser();

  if (!_user?.isStaff && !_user?.isSuperUser) return notFound();
  const user = await prisma.user.findUnique({
    where: { id },
    include: { team: true },
  });
  if (!user) return notFound();
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <StaffForm user={user as any} />
      </div>
    </ScrollArea>
  );
};

export default UpdateStaffPage;
