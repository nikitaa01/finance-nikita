"use client";

import { useRef } from "react";
import { AddExpenseForm } from "./add-expense-form";
import { DialogClose } from "./ui/dialog";

export function AddExpenseFormWithClose() {
  const closeRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <DialogClose ref={closeRef} className="hidden" />
      <AddExpenseForm
        onSubmit={() => {
          closeRef.current?.click();
        }}
      />
    </>
  );
}
