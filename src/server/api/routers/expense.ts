import { expense } from "@/server/db/schemas/expense";
import { and, eq, gte, lte, sql } from "drizzle-orm";
import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const expenseRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        amount: z.number(),
        date: z.date(),
        expenseSubcategoryId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .insert(expense)
        .values({
          userId: ctx.session.user.id,
          amount: input.amount,
          date: input.date,
          expenseSubcategoryId: String(input.expenseSubcategoryId),
        })
        .returning();
    }),
  getTotalMonthlyExpenses: protectedProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalMonthlyExpenses] = await ctx.db
      .select({
        total: sql<number>`sum(${expense.amount})`,
      })
      .from(expense)
      .where(
        and(
          eq(expense.userId, ctx.session.user.id),
          gte(expense.date, firstDay),
          lte(expense.date, now),
        ),
      );

    return totalMonthlyExpenses?.total ?? 0;
  }),
});
