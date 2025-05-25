"use client";

import { Button } from "@/components/ui/button";
import { handleDeleteCategoryAction } from "@/server/actions/category/delete-category-action";
import { useCategoriesStore } from "@/stores/categories-store";
import { Trash } from "lucide-react";
import { toast } from "sonner";

export function DeleteButton({ id }: { id: number }) {
  const deleteCategoryWithTags = useCategoriesStore(
    (state) => state.deleteCategoryWithTags,
  );

  return (
    <Button
      variant={"ghost"}
      size={"icon"}
      onClick={async () => {
        const revert = deleteCategoryWithTags(id);
        const result = await handleDeleteCategoryAction(id);

        console.log(result);

        if (result.status === "success") {
          toast.success(result.data);
          return;
        }

        toast.error(result.errors);
        revert();
      }}
    >
      <Trash />
    </Button>
  );
}
