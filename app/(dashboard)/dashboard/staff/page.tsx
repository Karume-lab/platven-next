import BreadCrumb from "@/components/breadcrumb";
import StaffDataTable from "@/components/tables/user-tables/staffs-data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { getSessionUser } from "@/lib/auth-utils";
import prisma from "@/prisma/client";
import { notFound } from "next/navigation";

const breadcrumbItems = [{ title: "User", link: "/dashboard/user" }];
export default async function page() {
  const user = await getSessionUser();

  if (!user?.isStaff && !user?.isSuperUser) return notFound();
  const users = await prisma.user.findMany({
    where: { OR: [{ isStaff: true }, { isSuperUser: true }] },
    include: { team: true },
  });
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title={`Staffs (${users.length})`}
            description="Manage Staffs"
          />
        </div>
        <Separator />
        <StaffDataTable users={users} />
      </div>
    </>
  );
}
