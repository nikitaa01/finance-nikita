"use server";

import { getUser } from "@/server/services/auth/get-user";
import { deleteCategory } from "@/server/services/category/delete-category";
import type { Action } from "@/types/action";

export const handleDeleteCategoryAction: Action<string, string> = async (
  _,
  formData,
) => {
  const user = await getUser();

  const id = formData.get("id");

  if (!id) {
    return { status: "error", errors: "id is required" };
  }

  const idNumber = Number(id);

  if (isNaN(idNumber)) {
    return { status: "error", errors: "id is not a number" };
  }

  try {
    await deleteCategory(idNumber, user.id);
  } catch {
    return {
      status: "error",
      errors: "Failed to delete category",
    };
  }

  return {
    status: "success",
    data: "Category deleted successfully",
  };
};
