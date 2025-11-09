import { HydrateClient, api } from "@/trpc/server";
import { Plus } from "lucide-react";
import { connection } from "next/server";
import { Suspense } from "react";
import { AddExpenseHomeDashboardForm } from "../_components/add-expense-home-dashboard-form";
import { ExpensesByDayAndSubcategoryChart } from "../_components/expenses-by-day-and-subcategory-chart";
import { TotalMonthlyExpensesNumber } from "../_components/total-monthly-expenses-number";
import { Button } from "../_components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "../_components/ui/drawer";
import { Skeleton } from "../_components/ui/skeleton";
import { H1, H3, P } from "../_components/ui/typography";

export default function Home() {
  return (
    <div className="space-y-8">
      <HeaderSection />
      <TotalMonthlyExpensesSection />
      <ExpensesByDayAndSubcategorySection />
    </div>
  );
}

function HeaderSection() {
  return (
    <section className="flex items-center justify-between gap-2">
      <div>
        <H1>Dashboard</H1>
        <P className="mt-2!">Track and manage your daily expenses</P>
      </div>
      <Drawer direction="right">
        <DrawerTrigger asChild>
          <Button>
            <Plus /> Add Expense
          </Button>
        </DrawerTrigger>
        <DrawerContent className="rounded-l-md">
          <DrawerTitle>Add Expense</DrawerTitle>
          <DrawerDescription>
            Add a new expense to your account
          </DrawerDescription>
          <div className="mt-6">
            <Suspense fallback={<div>Loading...</div>}>
              <HeaderSectionDynamic />
            </Suspense>
          </div>
        </DrawerContent>
      </Drawer>
    </section>
  );
}

async function HeaderSectionDynamic() {
  await connection();
  return (
    <HydrateClient
      queryOptions={api.expenseCategory.getAllWithSubcategories.queryOptions()}
    >
      <AddExpenseHomeDashboardForm />
    </HydrateClient>
  );
}
async function TotalMonthlyExpensesSection() {
  return (
    <section className="rounded-md border px-6 py-4">
      <H3>Total Monthly Expenses</H3>
      <P className="mt-2!">
        The total amount of expenses for the current month.
      </P>
      <div className="mt-6">
        <Suspense
          fallback={
            <H1>
              <Skeleton className="h-10 w-[10ch]" />
            </H1>
          }
        >
          <TotalMonthlyExpensesSectionDynamic />
        </Suspense>
      </div>
    </section>
  );
}

async function TotalMonthlyExpensesSectionDynamic() {
  await connection();
  return (
    <HydrateClient
      queryOptions={api.expense.getTotalMonthlyExpenses.queryOptions()}
    >
      <TotalMonthlyExpensesNumber />
    </HydrateClient>
  );
}

async function ExpensesByDayAndSubcategorySection() {
  return (
    <section className="rounded-md border px-6 py-4">
      <H3>Expenses by Day and Subcategory</H3>
      <P className="mt-2!">
        The expenses by day and subcategory for the current month.
      </P>
      <ExpensesByDayAndSubcategorySectionDynamic />
    </section>
  );
}

async function ExpensesByDayAndSubcategorySectionDynamic() {
  await connection();
  return (
    <HydrateClient
      queryOptions={api.expense.getMonthlyExpensesByDayAndSubcategory.queryOptions()}
    >
      <div className="h-96 w-full max-w-full">
        <ExpensesByDayAndSubcategoryChart />
      </div>
    </HydrateClient>
  );
}
