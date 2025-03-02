import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import type { Category } from "@/server/db/schema/category";
import type { CategoryTag } from "@/server/db/schema/category-tag";
import { getAllCategoriesWithTags } from "@/server/services/category/get-all-categories";
import { PlusIcon } from "lucide-react";
import { Suspense } from "react";
import { CreateCategoryDrawer } from "../../../components/create-category-drawer";
import { CategoriesTable } from "./components/categories-table";

export const experimental_ppr = true;

export type CategoriesTableData = Category & { tags: CategoryTag[] };

export default function Categories() {
  return (
    <div className="mx-auto flex size-full max-w-screen-sm flex-col gap-4">
      <CreateCategoryDrawer
        triggerAsChild
        trigger={
          <Button>
            <PlusIcon />
            Create Category
          </Button>
        }
      />
      <Suspense fallback={<Loader />}>
        <CategoriesTableWrapper />
      </Suspense>
    </div>
  );
}

async function CategoriesTableWrapper() {
  const allCategories = await getAllCategoriesWithTags();

  const mapToDataTable = (
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

  return <CategoriesTable data={mapToDataTable(allCategories)} />;
}
