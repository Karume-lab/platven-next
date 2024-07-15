import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formartCurrency } from "@/lib/utils";
import prisma from "@/prisma/client";
import { User } from "@prisma/client";
import moment from "moment/moment";

interface Props {
  user: User;
}

export async function RecentSales({ user }: Props) {
  const payments = await prisma.payment.findMany({
    where: {
      property: {
        userId: user.isSuperUser || user.isStaff ? undefined : user.id,
        user: { isStaff: false, isSuperUser: false },
      },
      complete: true,
    },
    include: {
      property: { include: { user: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 6,
  });
  return (
    <div className="space-y-8">
      {payments.map((payment, index) => (
        <div className="flex items-center" key={`${index}-${payment.id}`}>
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {`${payment.property.user.name}(${payment.property.title})`}
            </p>
            <p className="text-sm text-muted-foreground">
              {moment(payment.updatedAt).format("Do ddd MMM yyy hh:mm A")}
            </p>
          </div>
          <div className="ml-auto font-medium">
            {formartCurrency(Number(payment.amount))}
          </div>
        </div>
      ))}
    </div>
  );
}
