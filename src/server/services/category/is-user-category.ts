import { db } from "@/server/db";
import { category } from "@/server/db/schema/category";
import { and, eq } from "drizzle-orm";

export const getIsUserCategory = async (categoryId: number, userId: string) => {
  const categoryExists = await db
    .select()
    .from(category)
    .where(
      and(eq(category.id, Number(categoryId)), eq(category.userId, userId)),
    )
    .get();

  if (!categoryExists) {
    return false;
  }

  return true;
};
