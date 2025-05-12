"use client";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { handleCreateCategoryAction } from "@/server/actions/category/create-category-action";
import { useCategoriesStore } from "@/stores/categories-store";
import type { ActionStateByAction } from "@/types/action";
import type { Dispatch, ReactElement, SetStateAction } from "react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { FormDrawerFooter } from "./form-drawer-footer";
import { NameColorForm } from "./name-color-form";

function useUpdateCategoriesOnSuccess({
  state,
  setOpen,
}: {
  state: ActionStateByAction<typeof handleCreateCategoryAction>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const addCategoryWithTags = useCategoriesStore(
    (state) => state.addCategoryWithTags,
  );

  useEffect(() => {
    if (state.status === "success") {
      addCategoryWithTags(state.data.categoryWithTags);
      toast.success(state.data.message);
      setOpen(false);
    }
  }, [state, addCategoryWithTags, setOpen]);

  return null;
}

const initialState: ActionStateByAction<typeof handleCreateCategoryAction> = {
  status: "not-started",
};

export function CreateCategoryDrawer({
  trigger,
  triggerAsChild,
}: {
  trigger: ReactElement;
  triggerAsChild?: boolean;
}) {
  const [state, action, pending] = useActionState(
    handleCreateCategoryAction,
    initialState,
  );
  const errors = state.status === "error" ? state.errors : {};

  const [open, setOpen] = useState(false);

  useUpdateCategoriesOnSuccess({ state, setOpen });

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild={triggerAsChild}>{trigger}</DrawerTrigger>
      <DrawerContent>
        <form action={action} className="mx-auto w-full max-w-screen-sm">
          <DrawerHeader>
            <DrawerTitle>Create New Category</DrawerTitle>
            <DrawerDescription>
              Add a new category to your list.
            </DrawerDescription>
          </DrawerHeader>
          <NameColorForm errors={errors} />
          <FormDrawerFooter pending={pending}>Create Category</FormDrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
