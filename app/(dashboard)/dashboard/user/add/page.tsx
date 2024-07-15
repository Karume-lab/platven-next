import BreadCrumb from "@/components/breadcrumb";
import { ProductForm } from "@/components/forms/product-form";
import StaffForm from "@/components/forms/staff/staff-fom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getSessionUser } from "@/lib/auth-utils";
import { notFound } from "next/navigation";
import React from "react";

const breadcrumbItems = [
  { title: "User", link: "/dashboard/user" },
  { title: "Create", link: "/dashboard/user/create" },
];
export default async function Page() {
  const user = await getSessionUser();
  if (!user?.isStaff && !user?.isSuperUser) return notFound();
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
        <StaffForm />
      </div>
    </ScrollArea>
  );
}
