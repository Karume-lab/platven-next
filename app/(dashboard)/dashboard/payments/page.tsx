import BreadCrumb from "@/components/breadcrumb";
import PaymentsDataTable from "@/components/tables/payments/payments-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { getSessionUser } from "@/lib/auth-utils";
import prisma from "@/prisma/client";
import { PropsWithSearchParams } from "@/types";
import { redirect } from "next/navigation";
import React, { FC } from "react";
const breadcrumbItems = [{ title: "User", link: "/dashboard/user" }];

const PyamentsPage: FC<PropsWithSearchParams> = async ({ searchParams }) => {
  const user = await getSessionUser();
  if (!user)
    redirect(
      "sign-in?callbackUrk=" + encodeURIComponent("/dashboard/payments"),
    );
  const payments = await prisma.payment.findMany({
    where: {
      property: {
        userId: user.isStaff || user.isSuperUser ? undefined : user.id,
        user: { //Ignore None paymennts for staff/superusers
          isStaff:false,
          isSuperUser: false
        }
      },
    },
    include: { property: { include: { user: true } } },
  });
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title={`Payments (${payments.length})`}
            description="Manage payents"
          />
        </div>
        <Separator />
        <PaymentsDataTable payments={payments} />
      </div>
    </>
  );
};

export default PyamentsPage;
