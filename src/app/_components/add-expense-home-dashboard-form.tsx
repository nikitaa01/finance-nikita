"use client";

import { Plus } from "lucide-react";
import type React from "react";
import { useRef } from "react";
import { AddExpenseForm } from "./add-expense-form";
import { Button } from "./ui/button";
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
  NestedDrawer,
} from "./ui/drawer";

export function AddExpenseHomeDashboardForm() {
  const closeRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <DrawerClose ref={closeRef} className="hidden" />
      <AddExpenseForm
        onSubmit={() => {
          closeRef.current?.click();
        }}
        CreateSubcategoryWrapper={CreateSubcategoryWrapper}
      />
    </>
  );
}

function CreateSubcategoryWrapper({ children }: { children: React.ReactNode }) {
  return (
    <NestedDrawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline" type="button" size="icon">
          <Plus />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerTitle>Add Subcategory</DrawerTitle>
        <DrawerDescription>
          Add a new subcategory to your account
        </DrawerDescription>
        <div className="mt-6">{children}</div>
      </DrawerContent>
    </NestedDrawer>
  );
}
