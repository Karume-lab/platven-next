"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import { Contact } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import moment from "moment";
import MessageAction from "./cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Contact>[] = [
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
    accessorKey: "name",
    header: "Name",
    cell(props) {
      const recode = props.row.original;
      const renderValue = props.renderValue();
      return (
        <span className={clsx({ "font-bold": !recode.isAddressed })}>
          {renderValue as any}
        </span>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell(props) {
      const recode = props.row.original;
      const renderValue = props.renderValue();
      return (
        <span className={clsx({ "font-bold": !recode.isAddressed })}>
          {renderValue as any}
        </span>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone number",
    cell(props) {
      const recode = props.row.original;
      const renderValue = props.renderValue();
      return (
        <span className={clsx({ "font-bold": !recode.isAddressed })}>
          {renderValue as any}
        </span>
      );
    },
  },
  {
    accessorKey: "subject",
    header: "Subject",
    cell(props) {
      const recode = props.row.original;
      const renderValue = props.renderValue();
      return (
        <span className={clsx({ "font-bold": !recode.isAddressed })}>
          {renderValue as any}
        </span>
      );
    },
  },
  {
    accessorKey: "isAddressed",
    header: "Is Address",
    cell(props) {
      const paymentComplete = props.renderValue() as boolean;
      return (
        <Badge
          className={clsx({
            "bg-destructive": !paymentComplete,
            "bg-green-800": paymentComplete,
          })}
        >
          {paymentComplete ? "Addressed" : "Pending"}
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
      return <MessageAction message={property} />;
    },
  },
];
