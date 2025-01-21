"use client";

import { DataTable } from "@/components/data-table";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { CategoriesTableData } from "../page";
import { EditableTag } from "./editable-tag";

const columnHelper = createColumnHelper<CategoriesTableData>();

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
  }) as ColumnDef<CategoriesTableData, unknown>,
  columnHelper.accessor("tags", {
    header: "Tags",
    cell: ({ getValue }) => (
      <div className="flex flex-row gap-2 flex-wrap">
        {getValue().map((tag) => (
          <EditableTag key={tag.id} {...tag} />
        ))}
      </div>
    ),
  }) as ColumnDef<CategoriesTableData, unknown>,
];

export const CategoriesTable = ({ data }: { data: CategoriesTableData[] }) => {
  return <DataTable columns={columns} data={data} />;
};
