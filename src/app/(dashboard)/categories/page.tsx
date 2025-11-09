import { AddExpenseCategoryFormWithCloseDrawer } from "@/app/_components/add-expense-category-form-with-close-drawer";
import { ExpenseCategoriesTable } from "@/app/_components/expense-categories-table";
import { Button } from "@/app/_components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/_components/ui/drawer";
import { H1, P } from "@/app/_components/ui/typography";
import { HydrateClient, api } from "@/trpc/server";
import { Plus } from "lucide-react";
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
      <Drawer direction="right">
        <DrawerTrigger asChild>
          <Button>
            <Plus /> Add Category
          </Button>
        </DrawerTrigger>
        <DrawerContent className="rounded-l-md">
          <DrawerTitle>Add Category</DrawerTitle>
          <DrawerDescription>
            Add a new category to your account
          </DrawerDescription>
          <div className="mt-6">
            <AddExpenseCategoryFormWithCloseDrawer />
          </div>
        </DrawerContent>
      </Drawer>
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
