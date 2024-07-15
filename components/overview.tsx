import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formartCurrency } from "@/lib/utils";
import prisma from "@/prisma/client";
import { User } from "@prisma/client";
import moment from "moment/moment";

export async function Overview({ user }: { user: User }) {
  const properties = await prisma.property.findMany({
    take: 6,
    orderBy: { updatedAt: "desc" },
    where: {
      userId: user.isSuperUser || user.isStaff ? undefined : user.id,
      payment: { complete: true },
      isActive: true,
    },
  });
  return (
    <div className="space-y-8">
      {properties.map((property, index) => (
        <div className="flex items-center" key={`${index}-${property.id}`}>
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {`${property.title}`}
            </p>
            <p className="text-sm text-muted-foreground">
              {moment(property.updatedAt).format("Do ddd MMM yyy hh:mm A")}
            </p>
          </div>
          <div className="ml-auto font-medium">
            {formartCurrency(Number(property.price))}
          </div>
        </div>
      ))}
    </div>
  );
}
