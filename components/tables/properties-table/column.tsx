"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { Property, PropertyType } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import { BadgeCheck, BadgeX } from "lucide-react";
import moment from "moment";
import { PropertyActions } from "./property-actions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Property & { type: PropertyType }>[] = [
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
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "type.title",
    header: "Types",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "payment.complete",
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
    accessorKey: "isActive",
    header: "Approved status",
    cell(props) {
      const paymentComplete = props.renderValue() as boolean;
      const property = props.row.original;
      return (
        <Badge
          className={clsx({
            "bg-destructive": !paymentComplete,
            "bg-green-800": paymentComplete,
          })}
        >
          {paymentComplete
            ? "Approved"
            : property.rejectionReason
            ? "Rejected"
            : "Pending"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "rejectionReason",
    header: "Rejection Reason",
    cell(props) {
      const paymentComplete = props.renderValue() as string | null;
      const property = props.row.original;
      return <span>{paymentComplete ? paymentComplete : "-"}</span>;
    },
  },
  {
    accessorKey: "county",
    header: "County",
  },
  {
    accessorKey: "subCounty",
    header: "Sub county",
  },
  {
    accessorKey: "listed",
    header: "Is listed",
    cell(props) {
      return props.renderValue() ? (
        <BadgeCheck className="text-green-600" />
      ) : (
        <BadgeX className="text-destructive" />
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
    cell: ({ row }) => <PropertyActions property={row.original} />,
  },
];
