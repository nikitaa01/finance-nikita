import { db } from "@/server/db";
import type { InsertCategory } from "@/server/db/schema/category";
import { category } from "@/server/db/schema/category";

export const createCategory = async (categoryData: InsertCategory) => {
  // Insert the category into the database
  const newCategory = await db.insert(category).values(categoryData).run();

  return newCategory;

}