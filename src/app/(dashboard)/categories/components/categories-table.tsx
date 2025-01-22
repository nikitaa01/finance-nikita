"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import { Trash } from "lucide-react";
import type { CategoriesTableData } from "../page";
import { EditableTag } from "./editable-tag";

const columnHelper = createColumnHelper<CategoriesTableData>();

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
  }) as ColumnDef<CategoriesTableData, unknown>,
  columnHelper.accessor("color", {
    header: "Color",
    cell: ({ getValue }) => (
      <div
        className="size-6 rounded-full"
        style={{ backgroundColor: getValue() }}
      />
    ),
  }) as ColumnDef<CategoriesTableData, unknown>,
  columnHelper.accessor("tags", {
    header: "Tags",
    cell: ({ getValue }) => (
      <div className="flex flex-row flex-wrap gap-2">
        {getValue().map((tag) => (
          <EditableTag key={tag.id} {...tag} />
        ))}
      </div>
    ),
  }) as ColumnDef<CategoriesTableData, unknown>,
  columnHelper.display({
    header: "Actions",
    maxSize: 10,
    cell: () => (
      <Button variant={"destructive"} size={"icon"}>
        <Trash />
      </Button>
    ),
  }) as ColumnDef<CategoriesTableData, unknown>,
];

export const CategoriesTable = ({ data }: { data: CategoriesTableData[] }) => {
  return <DataTable columns={columns} data={data} />;
};
