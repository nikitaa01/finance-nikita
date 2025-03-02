"use server";

import { getUser } from "@/server/services/auth/get-user";
import { createCategory } from "@/server/services/category/create-category";
import type { Action } from "@/types/action";

export type Errors = {
  name?: string;
  color?: string;
  form?: string;
};

export const handleCreateCategoryAction: Action<string, Errors> = async (
  _,
  formData,
) => {
  const name = formData.get("name");
  const color = formData.get("color");

  const errors: Record<string, string> = {};
  if (!name) {
    errors.name = "Name is required";
  }
  if (!color) {
    errors.color = "Color is required";
  }
  if (Object.keys(errors).length > 0) {
    return { status: "error", errors };
  }

  const user = await getUser();

  try {
    await createCategory({
      color: String(color),
      name: String(name),
      userId: user.id,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: category.name, category.user_id"
    ) {
      return {
        status: "error",
        errors: { name: `Category with name ${name} already exists` },
      };
    }
    return {
      status: "error",
      errors: { form: "An error occurred while creating the category" },
    };
  }
  return { status: "success", data: `Category ${name} created successfully` };
};
