import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import type { Category } from "@/server/db/schema/category";
import type { CategoryTag } from "@/server/db/schema/category-tag";
import { getAllCategoriesWithTags } from "@/server/services/category/get-all-categories";
import { CategoriesStoreProvider } from "@/stores/categories-store";
import { PlusIcon } from "lucide-react";
import { Suspense } from "react";
import { CreateCategoryDrawer } from "../../../components/create-category-drawer";
import { CategoriesTable } from "./components/categories-table";

export const experimental_ppr = true;

export type CategoriesTableData = Category & { tags: CategoryTag[] };

export default function Categories() {
  return (
    <div className="mx-auto flex size-full max-w-screen-sm flex-col gap-4">
      <Suspense fallback={<Loader />}>
        <CategoriesDataLoader>
          <CreateCategoryDrawer
            triggerAsChild
            trigger={
              <Button>
                <PlusIcon />
                Create Category
              </Button>
            }
          />
          <CategoriesTable />
        </CategoriesDataLoader>
      </Suspense>
    </div>
  );
}

async function CategoriesDataLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const allCategories = await getAllCategoriesWithTags();

  const mapToCategoriesWithTags = (
    categories: typeof allCategories,
  ): CategoriesTableData[] => {
    const data: Record<number, CategoriesTableData> = {};

    for (const { category, "category-tag": tag } of categories) {
      data[category.id] ??= {
        ...category,
        tags: [],
      };

      if (tag) {
        data[category.id].tags.push(tag);
      }
    }

    return Object.values(data);
  };

  return (
    <CategoriesStoreProvider
      categoriesWithTags={mapToCategoriesWithTags(allCategories)}
    >
      {children}
    </CategoriesStoreProvider>
  );
}
