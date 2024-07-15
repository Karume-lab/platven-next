import BreadCrumb from "@/components/breadcrumb";
import MakePaymentForm from "@/components/forms/payment/make-payment-form";
import PropertyForm from "@/components/forms/properties/properties-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import prisma from "@/prisma/client";
import { PropsWithPathParams } from "@/types";
import { notFound, redirect } from "next/navigation";
import { FC } from "react";
import { z } from "zod";

const breadcrumbItems = [
  { title: "Properties", link: "/dashboard/properties" },
  { title: "Pay property", link: "/dashboard/properties/pay" },
];
const page: FC<PropsWithPathParams> = async ({ params: { id } }) => {
  if (!z.string().uuid().safeParse(id).success) return notFound();
  const property = await prisma.property.findUnique({
    where: { id },
    include: { user: true, payment: true },
  });
  if (!property) return notFound();

  if(property.payment?.complete) redirect("/dashboard/properties")

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>{`Pay Ksh. 100 to list ${property.title}`}</CardTitle>
          </CardHeader>
          <CardContent>
            <MakePaymentForm property={property as any} />
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default page;
