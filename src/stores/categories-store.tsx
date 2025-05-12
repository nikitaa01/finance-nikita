"use client";

import type { Category } from "@/server/db/schema/category";
import type { CategoryTag } from "@/server/db/schema/category-tag";
import type { RefObject } from "react";
import { createContext, use, useRef } from "react";
import type { StoreApi } from "zustand";
import { createStore, useStore } from "zustand";

export type CategoryWithTags = Category & { tags: CategoryTag[] };

interface CategoriesStore {
  categoriesWithTags: CategoryWithTags[];
  addCategoryWithTags: (categoryWithTags: CategoryWithTags) => void;
  deleteCategoryWithTags: (id: number) => void;
  addTagToCategory: (categoryId: number, tag: CategoryTag) => void;
}

export const categoriesStore = (
  initialCategoriesWithTags: CategoryWithTags[],
) =>
  createStore<CategoriesStore>((set) => ({
    categoriesWithTags: initialCategoriesWithTags,
    addCategoryWithTags: (categoryWithTags: CategoryWithTags) =>
      set((state) => ({
        categoriesWithTags: [...state.categoriesWithTags, categoryWithTags],
      })),
    deleteCategoryWithTags: (id: number) =>
      set((state) => ({
        categoriesWithTags: state.categoriesWithTags.filter(
          (category) => category.id !== id,
        ),
      })),
    addTagToCategory: (categoryId: number, tag: CategoryTag) =>
      set((state) => ({
        categoriesWithTags: state.categoriesWithTags.map((category) =>
          category.id === categoryId
            ? { ...category, tags: [...category.tags, tag] }
            : category,
        ),
      })),
  }));

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
