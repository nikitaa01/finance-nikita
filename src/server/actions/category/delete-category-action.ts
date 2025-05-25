"use server";

import { getUser } from "@/server/services/auth/get-user";
import { deleteCategory } from "@/server/services/category/delete-category";

export const handleDeleteCategoryAction = async (id: number) => {
  const user = await getUser();

  if (!id) {
    return { status: "error", errors: "id is required" } as const;
  }

  try {
    const result = await deleteCategory(id, user.id);

    if (result.rowsAffected === 0) {
      return {
        status: "error",
        errors: "Category not found",
      } as const;
    }
  } catch {
    return {
      status: "error",
      errors: "Failed to delete category",
    } as const;
  }

  return {
    status: "success",
    data: "Category deleted successfully",
  } as const;
};
