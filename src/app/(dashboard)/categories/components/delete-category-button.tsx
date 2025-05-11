"use client";

import { Button } from "@/components/ui/button";
import { handleDeleteCategoryAction } from "@/server/actions/category/delete-category-action";
import { useCategoriesStore } from "@/stores/categories-store";
import { Loader2, Trash } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

export function DeleteButton({ id }: { id: number }) {
  const [state, action, pending] = useActionState(handleDeleteCategoryAction, {
    status: "not-started",
  });

  const deleteCategoryWithTags = useCategoriesStore(
    (state) => state.deleteCategoryWithTags,
  );

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.data);
      deleteCategoryWithTags(id);
    }
    if (state.status === "error") {
      toast.error(state.errors);
    }
  }, [state, deleteCategoryWithTags, id, pending]);

  return (
    <form
      action={action}
      onSubmit={() => {
        console.log("submitted");
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button variant={"ghost"} size={"icon"}>
        {pending ? <Loader2 className="animate-spin" /> : <Trash />}
      </Button>
    </form>
  );
}
