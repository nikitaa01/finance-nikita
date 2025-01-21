import { Button } from "@/components/ui/button";
import { Category } from "@/server/db/schema/category";
import { CategoryTag } from "@/server/db/schema/category-tag";
import { getAllCategoriesWithTags } from "@/server/services/category/get-all-categories";
import { PlusIcon } from "lucide-react";
import { CreateCategoryDrawer } from "../../../components/create-category-drawer";
import { CategoriesTable } from "./components/categories-table";

export type CategoriesTableData = Category & { tags: CategoryTag[] };

export default async function Categories() {
  const allCategories = await getAllCategoriesWithTags();

  const mapToDataTable = (
    categories: typeof allCategories
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
    <div className="mx-auto w-full max-w-screen-sm flex flex-col gap-4">
      <CreateCategoryDrawer
        triggerAsChild
        trigger={
          <Button>
            <PlusIcon />
            Create Category
          </Button>
        }
      />
      <CategoriesTable data={mapToDataTable(allCategories)} />
    </div>
  );
}
