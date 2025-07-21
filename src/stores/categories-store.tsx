"use client";

import type { Category } from "@/server/db/schema/category";
import type { CategoryTag } from "@/server/db/schema/category-tag";
import type { RefObject } from "react";
import { createContext, use, useRef } from "react";
import type { StoreApi } from "zustand";
import { createStore, useStore } from "zustand";
import { optimistic } from "./optimistic";

export type CategoryWithTags = Category & { tags: CategoryTag[] };

interface CategoriesStore {
  categoriesWithTags: CategoryWithTags[];
  addCategoryWithTags: (categoryWithTags: CategoryWithTags) => () => void;
  deleteCategoryWithTags: (id: number) => () => void;
  updateCategoryWithTags: (
    id: number,
    categoryWithTags: CategoryWithTags,
  ) => () => void;
  addTagToCategory: (categoryId: number, tag: CategoryTag) => () => void;
}

export const categoriesStore = (
  initialCategoriesWithTags: CategoryWithTags[],
) =>
  createStore<CategoriesStore>(
    optimistic<CategoriesStore>((set, get, api) => {
      const categoriesWithTagsOptimisticActions = api.createOptimisticActions({
        getItems: (state) => state.categoriesWithTags,
        setItems: ({ items }) => ({ categoriesWithTags: items }),
        getId: (item) => item.id,
      });

      return {
        categoriesWithTags: initialCategoriesWithTags,
        addCategoryWithTags: (categoryWithTags: CategoryWithTags) => {
          const reset =
            categoriesWithTagsOptimisticActions.create(categoryWithTags);

          return reset;
        },
        deleteCategoryWithTags: (id: number) => {
          const reset = categoriesWithTagsOptimisticActions.delete(id);

          return reset;
        },
        updateCategoryWithTags: (
          id: number,
          categoryWithTags: CategoryWithTags,
        ) => {
          const reset = categoriesWithTagsOptimisticActions.update(
            id,
            categoryWithTags,
          );

          return reset;
        },
        addTagToCategory: (categoryId: number, tag: CategoryTag) => {
          const categoryToUpdate = structuredClone(
            get().categoriesWithTags.find(
              (category) => category.id === categoryId,
            ),
          );

          if (!categoryToUpdate) {
            return () => {};
          }

          categoryToUpdate.tags.push(tag);

          const reset = categoriesWithTagsOptimisticActions.update(
            categoryId,
            categoryToUpdate,
          );

          return reset;
        },
      };
    }),
  );

const CategoriesStoreContext =
  createContext<RefObject<StoreApi<CategoriesStore> | null> | null>(null);

export const CategoriesStoreProvider = ({
  children,
  categoriesWithTags,
}: {
  children: React.ReactNode;
  categoriesWithTags: CategoryWithTags[];
}) => {
  const categoriesStoreRef = useRef<StoreApi<CategoriesStore> | null>(null);

  if (categoriesStoreRef.current === null) {
    categoriesStoreRef.current = categoriesStore(categoriesWithTags);
  }

  return (
    <CategoriesStoreContext.Provider value={categoriesStoreRef}>
      {children}
    </CategoriesStoreContext.Provider>
  );
};

export const useCategoriesStore = <T,>(
  selector: (state: CategoriesStore) => T,
) => {
  const categoriesStoreRef = use(CategoriesStoreContext);
  if (!categoriesStoreRef || categoriesStoreRef.current === null) {
    throw new Error("CategoriesStoreContext not found");
  }
  return useStore(categoriesStoreRef.current, selector);
};
