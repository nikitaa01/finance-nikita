import { expenseCategory } from "@/server/db/schemas/expense-category";
import { expenseSubcategory } from "@/server/db/schemas/expense-subcategory";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const expenseSubcategoryRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({
        id: expenseSubcategory.id,
        name: expenseSubcategory.name,
        color: expenseSubcategory.color,
      })
      .from(expenseSubcategory)
      .leftJoin(
        expenseCategory,
        eq(expenseSubcategory.expenseCategoryId, expenseCategory.id),
      )
      .where(eq(expenseCategory.userId, ctx.session.user.id));
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        color: z.string(),
        expenseCategoryId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const expenseCategoryUserId = await ctx.db
        .select({ userId: expenseCategory.userId })
        .from(expenseCategory)
        .where(eq(expenseCategory.id, input.expenseCategoryId))
        .limit(1)
        .get();

      if (expenseCategoryUserId?.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const [subcategory] = await ctx.db
        .insert(expenseSubcategory)
        .values({
          name: input.name,
          color: input.color,
          expenseCategoryId: input.expenseCategoryId,
        })
        .returning();
      return subcategory;
    }),
});
