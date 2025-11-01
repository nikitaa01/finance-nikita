"use client";

import { Plus } from "lucide-react";
import { useRef } from "react";
import {
  AddExpenseForm,
  type TCreateSubcategoryWrapperProps,
} from "./add-expense-form";
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

function CreateSubcategoryWrapper({
  children,
}: TCreateSubcategoryWrapperProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const handleClose = () => {
    closeRef.current?.click();
  };
  const Component = children;

  return (
    <NestedDrawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline" type="button" size="icon">
          <Plus />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="rounded-l-md">
        <DrawerClose ref={closeRef} className="hidden" />
        <DrawerTitle>Add Subcategory</DrawerTitle>
        <DrawerDescription>
          Add a new subcategory to your account
        </DrawerDescription>
        <div className="mt-6">
          <Component onSuccess={handleClose} />
        </div>
      </DrawerContent>
    </NestedDrawer>
  );
}
