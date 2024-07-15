"use client";
import { User } from "@prisma/client";
import { FC } from "react";
import { DataTable } from "../data-table";
import { columns } from "./columns";
// import { useRouter } from "next/navigation";

interface Props {
  users: User[];
}

const UsersDataTable: FC<Props> = ({ users }) => {
  // const router = useRouter();

  return <DataTable columns={columns()} data={users} />;
};

export default UsersDataTable;
