import { db } from "@/server/db";
import { category } from "@/server/db/schema/category";
import { and, eq } from "drizzle-orm";

export const deleteCategory = async (id: number, userId: string) => {
  const data = await db
    .delete(category)
    .where(and(eq(category.userId, userId), eq(category.id, id)))
    .run();

  return data;
};
