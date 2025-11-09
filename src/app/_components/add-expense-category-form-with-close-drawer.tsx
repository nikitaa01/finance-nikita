"use client";

import { useRef } from "react";
import { AddExpenseCategoryForm } from "./add-expense-category-form";
import { DrawerClose } from "./ui/drawer";

export function AddExpenseCategoryFormWithCloseDrawer() {
  const closeRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <DrawerClose ref={closeRef} className="hidden" />
      <AddExpenseCategoryForm
        onSuccess={() => {
          closeRef.current?.click();
        }}
      />
    </>
  );
}
