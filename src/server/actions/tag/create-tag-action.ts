"use server";

import type { CategoryTag } from "@/server/db/schema/category-tag";
import { getUser } from "@/server/services/auth/get-user";
import { createCategoryTag } from "@/server/services/category-tag/create-category-tag";
import { getIsUserCategory } from "@/server/services/category/is-user-category";
import type { Action } from "@/types/action";
import type { DrawerFormErrors } from "@/types/drawer-form";

export const handleCreateTagAction: Action<
  {
    tag: CategoryTag;
    message: string;
  },
  DrawerFormErrors
> = async (_, formData) => {
  const name = formData.get("name");
  const color = formData.get("color");
  const categoryId = formData.get("categoryId");

  const errors: Record<string, string> = {};
  if (!name) {
    errors.name = "Name is required";
  }
  if (!color) {
    errors.color = "Color is required";
  }
  if (!categoryId) {
    errors.form = "Category is required";
  }
  if (Object.keys(errors).length > 0) {
    return { status: "error", errors };
  }

  const user = await getUser();

  const isUserCategory = await getIsUserCategory(Number(categoryId), user.id);
  if (!isUserCategory) {
    return {
      status: "error",
      errors: { form: "Category not found" },
    };
  }

  try {
    const tag = await createCategoryTag({
      color: String(color),
      name: String(name),
      categoryId: Number(categoryId),
    });

    return {
      status: "success",
      data: {
        tag,
        message: `Tag ${name} created successfully`,
      },
    };
  } catch {
    return {
      status: "error",
      errors: { form: "An error occurred while creating the category" },
    };
  }
};
