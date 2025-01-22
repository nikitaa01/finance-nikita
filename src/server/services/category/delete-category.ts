import { db } from "@/server/db"
import { user } from "@/server/db/schema/auth"
import { category } from "@/server/db/schema/category"
import { and, eq } from "drizzle-orm"

export const deleteCategory = async (id: number, userId: string) => {
  const data = await db
    .delete(category)
    .where(
      and(
        eq(user.id, userId),
        eq(category.id, id))
    )
    .run()

  return data
}