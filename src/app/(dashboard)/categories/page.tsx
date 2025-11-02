import { ExpenseCategoriesTable } from "@/app/_components/expense-categories-table";
import { H1, P } from "@/app/_components/ui/typography";
import { HydrateClient, api } from "@/trpc/server";
import { connection } from "next/server";
import { Suspense } from "react";

export default function CategoriesPage() {
  return (
    <div className="space-y-8">
      <HeaderSection />
      <Suspense>
        <CategoriesTableSection />
      </Suspense>
    </div>
  );
}

function HeaderSection() {
  return (
    <section className="flex items-center justify-between gap-2">
      <div>
        <H1>Categories</H1>
        <P className="mt-2!">
          Manage your expense categories and subcategories
        </P>
      </div>
    </section>
  );
}

async function CategoriesTableSection() {
  await connection();
  return (
    <HydrateClient
      queryOptions={api.expenseCategory.getAllWithSubcategories.queryOptions()}
    >
      <ExpenseCategoriesTable />
    </HydrateClient>
  );
}
