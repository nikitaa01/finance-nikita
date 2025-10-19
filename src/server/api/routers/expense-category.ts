import {
  type ExpenseCategory,
  expenseCategory,
} from "@/server/db/schemas/expense-category";
import {
  type ExpenseSubcategory,
  expenseSubcategory,
} from "@/server/db/schemas/expense-subcategory";
import { eq } from "drizzle-orm";
import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const expenseCategoryRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({
        id: expenseCategory.id,
        name: expenseCategory.name,
        color: expenseCategory.color,
      })
      .from(expenseCategory)
      .where(eq(expenseCategory.userId, ctx.session.user.id));
  }),
  getAllWithSubcategories: protectedProcedure.query(async ({ ctx }) => {
    const rawData = await ctx.db
      .select()
      .from(expenseCategory)
      .leftJoin(
        expenseSubcategory,
        eq(expenseCategory.id, expenseSubcategory.expenseCategoryId),
      )
      .where(eq(expenseCategory.userId, ctx.session.user.id));

    const categoryMap = new Map<
      number,
      ExpenseCategory & { subcategories: ExpenseSubcategory[] }
    >();

    for (const row of rawData) {
      if (!categoryMap.has(row.expense_category.id)) {
        categoryMap.set(row.expense_category.id, {
          id: row.expense_category.id,
          name: row.expense_category.name,
          color: row.expense_category.color,
          createdAt: row.expense_category.createdAt,
          updatedAt: row.expense_category.updatedAt,
          userId: row.expense_category.userId,
          subcategories: [],
        });
      }

      if (row.expense_subcategory) {
        categoryMap.get(row.expense_category.id)?.subcategories.push({
          id: row.expense_subcategory.id,
          name: row.expense_subcategory.name,
          color: row.expense_subcategory.color,
          createdAt: row.expense_subcategory.createdAt,
          updatedAt: row.expense_subcategory.updatedAt,
          expenseCategoryId: row.expense_subcategory.expenseCategoryId,
        });
      }
    }

    return Array.from(categoryMap.values());
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        color: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [category] = await ctx.db
        .insert(expenseCategory)
        .values({
          userId: ctx.session.user.id,
          name: input.name,
          color: input.color,
        })
        .returning();

      return category;
    }),
});
