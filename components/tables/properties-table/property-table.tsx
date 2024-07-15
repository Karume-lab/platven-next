"use client";
import { Property, PropertyRequest, PropertyType } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { DataTable } from "../data-table";
import { columns } from "./column";

interface Props {
  properties: (Property & {
    type: PropertyType;
    requests: PropertyRequest[];
  })[];
}

const PropertyTable: FC<Props> = ({ properties }) => {
  const { push } = useRouter();
  return (
    <DataTable
      columns={columns}
      data={properties}
      onAdd={() => push("/dashboard/properties/add")}
    />
  );
};

export default PropertyTable;
