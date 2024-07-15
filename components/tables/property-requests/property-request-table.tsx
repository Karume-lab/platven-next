"use client";
import {
  PropertyRequest
} from "@prisma/client";
import { FC } from "react";
import { DataTable } from "../data-table";
import { columns } from "./column";

interface Props {
  messages: PropertyRequest[];
}

const PropertyRequestTable: FC<Props> = ({ messages }) => {
  return (
    <DataTable
      columns={columns}
      data={messages}
      //   onAdd={() => push("/dashboard/properties/add")}
    />
  );
};

export default PropertyRequestTable;
