"use client";

import { DataTable } from "@/components/data-table";
import { FormDrawerFooter } from "@/components/form-drawer-footer";
import { NameColorForm } from "@/components/name-color-form";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { handleCreateTagAction } from "@/server/actions/tag/create-tag-action";
import { useCategoriesStore } from "@/stores/categories-store";
import type { ActionStateByAction } from "@/types/action";
import type { ColumnDef } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import { Pencil, Plus } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import type { CategoriesTableData } from "../page";
import { DeleteButton } from "./delete-category-button";
import { EditableTag } from "./editable-tag";

const columnHelper = createColumnHelper<CategoriesTableData>();

const useUpdateTagsOnSuccess = ({
  state,
  setOpen,
  categoryId,
}: {
  state: ActionStateByAction<typeof handleCreateTagAction>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  categoryId: number;
}) => {
  const addTagToCategory = useCategoriesStore(
    (state) => state.addTagToCategory,
  );

  useEffect(() => {
    if (state.status === "success") {
      addTagToCategory(categoryId, state.data.tag);
      toast.success(state.data.message);
      setOpen(false);
    }
  }, [state, addTagToCategory, setOpen, categoryId]);

  return null;
};

function CreateCategoryTagDrawer({ categoryId }: { categoryId: number }) {
  const [state, action, pending] = useActionState(handleCreateTagAction, {
    status: "not-started",
  });

  const [open, setOpen] = useState(false);

  const errors = state.status === "error" ? state.errors : {};

  useUpdateTagsOnSuccess({
    state,
    setOpen,
    categoryId,
  });

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <Plus />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <form action={action} className="mx-auto w-full max-w-screen-sm">
          <input type="hidden" name="categoryId" value={categoryId} />
          <DrawerHeader>
            <DrawerTitle>Create Category Tag</DrawerTitle>
            <DrawerDescription>
              Add a new tag to the category.
            </DrawerDescription>
          </DrawerHeader>
          <NameColorForm errors={errors} />
          <FormDrawerFooter pending={pending}>Create Tag</FormDrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}

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
    cell: ({ getValue, row }) => (
      <div className="flex w-80 flex-row flex-wrap gap-2">
        {getValue().map((tag) => (
          <EditableTag key={tag.id} {...tag} />
        ))}
        <CreateCategoryTagDrawer categoryId={row.original.id} />
      </div>
    ),
  }) as ColumnDef<CategoriesTableData, unknown>,
  columnHelper.display({
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex flex-row gap-2">
        <Button variant={"ghost"} size={"icon"}>
          <Pencil />
        </Button>
        <DeleteButton id={row.original.id} />
      </div>
    ),
  }) as ColumnDef<CategoriesTableData, unknown>,
];

export const CategoriesTable = () => {
  const categoriesWithTags = useCategoriesStore(
    (state) => state.categoriesWithTags,
  );

  return (
    <DataTable
      columns={columns}
      data={categoriesWithTags}
      getRowId={(row) => row.id.toString()}
    />
  );
};
