import {
    Payment,
    Property,
    User
} from "@prisma/client";
import { FC } from "react";
import { DataTable } from "../data-table";
import { columns } from "./column";

interface Props {
  payments: (Payment & { property: Property & { user: User } })[];
}

const PaymentsDataTable: FC<Props> = ({ payments }) => {
  return <DataTable columns={columns} data={payments} />;
};

export default PaymentsDataTable;
