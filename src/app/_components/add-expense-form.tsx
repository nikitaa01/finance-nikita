"use client";

import type { ExpenseSubcategory } from "@/server/db/schemas/expense-subcategory";
import { api } from "@/trpc/react";
import { Check, ChevronDownIcon, Loader2, Plus } from "lucide-react";
import { Suspense, useState } from "react";
import { cn } from "../_lib/utils";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { DatePicker } from "./ui/date-picker";
import { Field, FieldGroup, FieldLabel, FieldSet } from "./ui/field";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Muted } from "./ui/typography";

export const AddExpenseForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const utils = api.useUtils();
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [subcategory, setSubcategory] = useState<
    ExpenseSubcategory | undefined
  >(undefined);
  const { mutate: createExpense, isPending } = api.expense.create.useMutation({
    onSettled: () => {},
    onSuccess: () => {
      onSuccess?.();
      utils.expense.invalidate();
    },
  });

  const handleSubmit = () => {
    if (!amount || !date || !subcategory) {
      return;
    }

    createExpense({
      amount,
      date,
      expenseSubcategoryId: subcategory?.id,
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit();
      }}
    >
      <FieldSet>
        <FieldGroup>
          <AmountField amount={amount} setAmount={setAmount} />
          <DateField date={date} setDate={setDate} />
          <Suspense fallback={<div>Loading...</div>}>
            <SubcategorySelectorField
              subcategory={subcategory}
              setSubcategory={setSubcategory}
            />
          </Suspense>
        </FieldGroup>
        <SubmitButton isPending={isPending} />
      </FieldSet>
    </form>
  );
};

function AmountField({
  amount,
  setAmount,
}: {
  amount: number | undefined;
  setAmount: (amount: number | undefined) => void;
}) {
  return (
    <Field>
      <FieldLabel htmlFor="amount">Amount</FieldLabel>
      <Input
        id="amount"
        type="number"
        name="amount"
        autoComplete="off"
        placeholder="0.00"
        value={amount ?? ""}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
    </Field>
  );
}

function DateField({
  date,
  setDate,
}: { date: Date | undefined; setDate: (date: Date | undefined) => void }) {
  return (
    <Field>
      <FieldLabel>Date</FieldLabel>
      <DatePicker date={date} onSelect={setDate} />
    </Field>
  );
}

function SubcategorySelectorField({
  subcategory: selectedSubcategory,
  setSubcategory,
}: {
  subcategory: ExpenseSubcategory | undefined;
  setSubcategory: (subcategory: ExpenseSubcategory | undefined) => void;
}) {
  const [categoriesWithSubcategories] =
    api.expenseCategory.getAllWithSubcategories.useSuspenseQuery();
  const [open, setOpen] = useState(false);

  return (
    <Field>
      <FieldLabel>Subcategory</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-between font-normal">
            {selectedSubcategory ? (
              selectedSubcategory.name
            ) : (
              <Muted>Select subcategory</Muted>
            )}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandInput placeholder="Search framework..." className="h-9" />
            <CommandList>
              <CommandEmpty>No subcategory found.</CommandEmpty>
              {categoriesWithSubcategories.map((category) => (
                <CommandGroup key={category.id} heading={category.name}>
                  {category.subcategories.map((subcategory) => (
                    <CommandItem
                      key={subcategory.id}
                      value={String(subcategory.id)}
                      onSelect={() => {
                        setSubcategory(subcategory);
                        setOpen(false);
                      }}
                    >
                      {subcategory.name}{" "}
                      <Check
                        className={cn(
                          "ml-auto",
                          selectedSubcategory?.id === subcategory.id
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </Field>
  );
}

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button type="submit">
      {isPending ? <Loader2 className="animate-spin" /> : <Plus />} Add Expense
    </Button>
  );
}

function AddExpenseSubcategoryForm() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input
              id="name"
              type="text"
              name="name"
              autoComplete="off"
              placeholder="e.g. Groceries"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="color">Color</FieldLabel>
            <Input id="color" type="color" name="color" />
          </Field>
        </FieldGroup>
        <Button type="submit" size={"sm"}>
          <Plus /> Add Subcategory
        </Button>
      </FieldSet>
    </form>
  );
}
