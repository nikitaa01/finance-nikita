"use server"

import { getUser } from "@/server/services/auth/get-user"
import { createCategory } from "@/server/services/category/create-category"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export const handleCreateCategoryAction = async ({ name, color, }: { name: string, color: string }) => {
  const user = await getUser()

  const headersList = await headers()

  const pathname = headersList.get("x-pathname")

  // Create the category
  const data = await createCategory({ color, name, userId: user.id })

  if (data.rowsAffected === 1 && pathname) {
    redirect(pathname)
  }

  return data
}