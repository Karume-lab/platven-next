"use client";
import { Payment } from "@prisma/client";
import React, { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

const PaymentsActions: FC<{ payment: Payment }> = ({ payment }) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {payment.complete && (
          <DropdownMenuItem>
            <Link href={`/dashboard/payments/${payment.id}`}>Get receipt</Link>
          </DropdownMenuItem>
        )}
        {!payment.complete && (
          <DropdownMenuItem>
            <Link href={`/dashboard/properties/${payment.propertyId}/pay`}>
              Complete Payment
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PaymentsActions;
