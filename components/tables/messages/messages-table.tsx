"use client";
import {
  Contact
} from "@prisma/client";
import { FC } from "react";
import { DataTable } from "../data-table";
import { columns } from "./column";

interface Props {
  messages: Contact[];
}

const MessagesTable: FC<Props> = ({ messages }) => {
  return (
    <DataTable
      columns={columns}
      data={messages}
      //   onAdd={() => push("/dashboard/properties/add")}
    />
  );
};

export default MessagesTable;
