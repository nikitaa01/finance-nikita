"use client";

import { DataTable } from "@/components/data-table";
import { useCategoriesStore } from "@/stores/categories-store";
import type { ColumnDef } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import type { CategoriesTableData } from "../page";
import { DeleteButton } from "./delete-category-button";
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
    cell: ({ row }) => <DeleteButton id={row.original.id} />,
  }) as ColumnDef<CategoriesTableData, unknown>,
];

export const CategoriesTable = () => {
  const categoriesWithTags = useCategoriesStore(
    (state) => state.categoriesWithTags,
  );

  console.log(categoriesWithTags);

  return (
    <DataTable
      columns={columns}
      data={categoriesWithTags}
      getRowId={(row) => row.id.toString()}
    />
  );
};
