import { HydrateClient, api } from "@/trpc/server";
import { Plus } from "lucide-react";
import { connection } from "next/server";
import { Suspense } from "react";
import { AddExpenseFormWithClose } from "../_components/add-expense-form-with-close";
import { TotalMonthlyExpensesNumber } from "../_components/total-monthly-expenses-number";
import { Button } from "../_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../_components/ui/dialog";
import { Skeleton } from "../_components/ui/skeleton";
import { H1, H3, P } from "../_components/ui/typography";

export default function Home() {
  return (
    <div className="space-y-8">
      <HeaderSection />
      <TotalMonthlyExpensesSection />
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
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus /> Add Expense
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>
            Add a new expense to your account
          </DialogDescription>
          <Suspense fallback={<div>Loading...</div>}>
            <HeaderSectionDynamic />
          </Suspense>
        </DialogContent>
      </Dialog>
    </section>
  );
}

async function HeaderSectionDynamic() {
  await connection();
  return (
    <HydrateClient
      queryOptions={api.expenseCategory.getAllWithSubcategories.queryOptions()}
    >
      <AddExpenseFormWithClose />
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
