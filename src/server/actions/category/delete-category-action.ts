"use server"

import { getUser } from "@/server/services/auth/get-user";
import { deleteCategory } from "@/server/services/category/delete-category";

export const handleDeleteCategoryAction = async ({ id, }: { id: number }) => {
  const user = await getUser();

  // Delete the category
  const data = await deleteCategory(id, user.id);

  return data;
};