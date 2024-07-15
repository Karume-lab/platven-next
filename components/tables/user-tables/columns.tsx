"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import { CellAction } from "./cell-action";
import { BadgeCheck, BadgeX } from "lucide-react";

export const columns = (isStaff = false) =>
  [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
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
    ...(isStaff
      ? [
          {
            accessorKey: "team.image",
            header: "Image",
            cell(props: any) {
              const user = props.row.original;
              return (
                <Avatar>
                  <AvatarImage
                    src={user?.team?.image ? `/${user.team.image}` : undefined}
                    alt="avatar"
                  />
                  <AvatarFallback>
                    {(user.name ?? user.email)[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              );
            },
          },
          {
            accessorKey: "team.position",
            header: "POSITION",
          },
          {
            accessorKey: "isSuperUser",
            header: "Role",
            cell(props: any) {
              const name = props.renderValue() as boolean;
              return (
                <Badge
                  className={clsx({
                    "bg-green-800": name,
                  })}
                >
                  {name ? "Super admin" : "Staff"}
                </Badge>
              );
            },
          },
        ]
      : [
          {
            accessorKey: "image",
            header: "Image",
            cell(props: any) {
              const user = props.row.original;
              return (
                <Avatar>
                  <AvatarImage
                    src={user.image ? `/${user.image}` : undefined}
                    alt="avatar"
                  />
                  <AvatarFallback>
                    {(user.name ?? user.email)[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              );
            },
          },
        ]),

    {
      accessorKey: "name",
      header: "NAME",
      cell(props) {
        const name = props.renderValue() as string | undefined;
        return <span>{name ? name : "-"}</span>;
      },
    },
    {
      accessorKey: "email",
      header: "EMAIL",
    },
    {
      accessorKey: "phoneNumber",
      header: "PHONE NUMBER",
    },
    {
      accessorKey: "address",
      header: "ADDRESS",
      cell(props) {
        const name = props.renderValue() as string | undefined;
        return <span>{name ? name : "-"}</span>;
      },
    },
    {
      accessorKey: "accountVerified",
      header: "Account Verified",
      cell(props) {
        return props.renderValue() ? (
          <BadgeCheck className="text-green-600" />
        ) : (
          <BadgeX className="text-destructive" />
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Is Active",
      cell(props) {
        const name = props.renderValue() as boolean;
        return (
          <Badge
            className={clsx({ "bg-destructive": !name, "bg-green-800": name })}
          >
            {name ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },

    {
      id: "actions",
      cell: ({ row }) => <CellAction data={row.original} />,
    },
  ] as ColumnDef<User>[];
