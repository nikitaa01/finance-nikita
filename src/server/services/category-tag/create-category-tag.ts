import { db } from "@/server/db";
import type { InsertCategoryTag } from "@/server/db/schema/category-tag";
import { categoryTag } from "@/server/db/schema/category-tag";

export const createCategoryTag = async (tag: InsertCategoryTag) => {
  const [newTag] = await db.insert(categoryTag).values(tag).returning();

  return newTag;
};
