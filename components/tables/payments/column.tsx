"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { Payment, Property, PropertyType, User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import { BadgeCheck, BadgeX } from "lucide-react";
import moment from "moment";
import PaymentsActions from "./payment-actions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<
  Payment & { property: Property & { user: User } }
>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   accessorKey: "images",
  //   header: "Image",
  //   cell: ({ row, renderValue }) => {
  //     return (
  //       <Image
  //         alt={row.getValue("title")}
  //         src={`/${(renderValue() as string[])[0]}`}
  //         width={100}
  //         height={100}
  //         className="h-20 w-40 object-cover rounded-xl"
  //       />
  //     );
  //   },
  // },
  {
    accessorKey: "property.user.name",
    header: "User",
  },
  // {
  //   accessorKey: "checkoutRequestId",
  //   header: "CheckutID",
  // },
  // {
  //   accessorKey: "merchantRequestId",
  //   header: "MerchantID",
  // },
  {
    accessorKey: "mpesareceiptNumber",
    header: "Receipt no",
  },
  {
    accessorKey: "property.title",
    header: "Property",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "phoneNumber",
    header: "Status",
  },
  {
    accessorKey: "complete",
    header: "Payment Status",
    cell(props) {
      const paymentComplete = props.renderValue() as boolean;
      return (
        <Badge
          className={clsx({
            "bg-destructive": !paymentComplete,
            "bg-green-800": paymentComplete,
          })}
        >
          {paymentComplete ? "Complete" : "Pending"}
        </Badge>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: "Date created",
    cell: ({ renderValue }) =>
      moment(renderValue() as string).format("Do MMM yyy"),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const property = row.original;
      return <PaymentsActions payment={property} />;
    },
  },
];
