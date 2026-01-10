import { expense } from "@/server/db/schemas/expense";
import { expenseSubcategory } from "@/server/db/schemas/expense-subcategory";
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
          expenseSubcategoryId: input.expenseSubcategoryId,
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
  getMonthlyExpensesByDayAndSubcategory: protectedProcedure.query(
    async ({ ctx }) => {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

      const monthlyExpenses = await ctx.db
        .select({
          date: expense.date,
          amount: expense.amount,
          subcategoryColor: expenseSubcategory.color,
          subcategoryName: expenseSubcategory.name,
        })
        .from(expense)
        .innerJoin(
          expenseSubcategory,
          eq(expense.expenseSubcategoryId, expenseSubcategory.id),
        )
        .where(
          and(
            eq(expense.userId, ctx.session.user.id),
            gte(expense.date, firstDay),
            lte(expense.date, now),
          ),
        );

      const expensesGroupedByDay = new Map<
        string,
        {
          date: string;
          entries: Map<string, { amount: number; color: string }>;
        }
      >();

      for (const expenseEntry of monthlyExpenses) {
        // Normalize to local date (start of day) to avoid timezone issues
        const localDate = new Date(
          expenseEntry.date.getFullYear(),
          expenseEntry.date.getMonth(),
          expenseEntry.date.getDate(),
        );
        const year = localDate.getFullYear();
        const month = String(localDate.getMonth() + 1).padStart(2, "0");
        const day = String(localDate.getDate()).padStart(2, "0");
        const dayKey = `${year}-${month}-${day}`;
        let dayEntry = expensesGroupedByDay.get(dayKey);
        if (!dayEntry) {
          dayEntry = { date: dayKey, entries: new Map() };
          expensesGroupedByDay.set(dayKey, dayEntry);
        }

        const currentTotal = dayEntry.entries.get(
          expenseEntry.subcategoryName,
        ) ?? { amount: 0, color: "" };

        dayEntry.entries.set(expenseEntry.subcategoryName, {
          amount: currentTotal.amount + expenseEntry.amount,
          color: expenseEntry.subcategoryColor,
        });
      }

      return Array.from(expensesGroupedByDay.values())
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((entry) => ({
          date: entry.date,
          entries: Array.from(entry.entries.entries()).map(
            ([name, { amount, color }]) => ({
              name,
              amount,
              color,
            }),
          ),
        }));
    },
  ),
});
