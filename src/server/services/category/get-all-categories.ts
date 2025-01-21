import { db } from "@/server/db";
import { category } from "@/server/db/schema/category";
import { categoryTag } from "@/server/db/schema/category-tag";
import { eq } from "drizzle-orm";
import { getUser } from "../auth/get-user";

export const getAllCategories = async () => {
  const user = await getUser();

  const categories = await db
    .select()
    .from(category)
    .where(eq(category.userId, user.id))
    .all();

  return categories;
};

export const getAllCategoriesWithTags = async () => {
  const user = await getUser();

  const categories = await db
    .select()
    .from(category)
    .leftJoin(categoryTag, eq(category.id, categoryTag.categoryId))
    .where(eq(category.userId, user.id))
    .all();

  return categories;
};
