"use client";

import type { ExpenseCategory } from "@/server/db/schemas/expense-category";
import type { ExpenseSubcategory } from "@/server/db/schemas/expense-subcategory";
import { type RouterOutputs, useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronDownIcon, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { colors } from "../_constants/colors";
import { cn } from "../_lib/utils";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "./ui/field";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Muted } from "./ui/typography";

export function AddExpenseSubcategoryForm({
  onSuccess,
  categoriesWithSubcategories,
}: {
  onSuccess: (category: ExpenseSubcategory | undefined) => void;
  categoriesWithSubcategories: RouterOutputs["expenseCategory"]["getAllWithSubcategories"];
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { mutate: createSubcategory, isPending } = useMutation(
    trpc.expenseSubcategory.create.mutationOptions({
      onSettled: () => {
        queryClient.invalidateQueries(trpc.expenseCategory.pathFilter());
        queryClient.invalidateQueries(trpc.expenseSubcategory.pathFilter());
      },
      onSuccess,
    }),
  );

  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<ExpenseCategory | undefined>(
    undefined,
  );
  const [selectedColor, setColor] = useState<string | undefined>(undefined);

  const handleSubmit = () => {
    if (
      name === "" ||
      selectedColor === undefined ||
      category?.id === undefined
    ) {
      return;
    }

    createSubcategory({
      name,
      color: selectedColor,
      expenseCategoryId: category?.id,
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
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              type="text"
              name="name"
              autoComplete="off"
              placeholder="e.g. Food"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <CategorySelectorField
            categoriesWithSubcategories={categoriesWithSubcategories}
            category={category}
            setCategory={setCategory}
          />
          <Field>
            <FieldLabel>Color</FieldLabel>
            <div className="grid grid-cols-8 gap-2">
              {colors.map((color) => (
                <label
                  className="aspect-square size-full rounded-full"
                  key={color.hex}
                  style={{
                    accentColor: color.hex,
                    backgroundColor: color.hex,
                  }}
                >
                  <input
                    name="color"
                    type="radio"
                    className="not-checked:sr-only size-full"
                    value={color.hex}
                    checked={color.hex === selectedColor}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </label>
              ))}
            </div>
          </Field>
        </FieldGroup>
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" /> : <Plus />} Add
          Subcategory
        </Button>
      </FieldSet>
    </form>
  );
}

function CategorySelectorField({
  category,
  setCategory,
  categoriesWithSubcategories,
  error,
}: {
  category: ExpenseCategory | undefined;
  setCategory: (subcategory: ExpenseCategory | undefined) => void;
  error?: string;
  categoriesWithSubcategories: RouterOutputs["expenseCategory"]["getAllWithSubcategories"];
}) {
  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel>Category</FieldLabel>
      <CategorySelectorPopover
        categoriesWithSubcategories={categoriesWithSubcategories}
        selectedCategory={category}
        setCategory={setCategory}
      />
      <FieldError>{error}</FieldError>
    </Field>
  );
}

function CategorySelectorPopover({
  categoriesWithSubcategories,
  selectedCategory,
  setCategory,
}: {
  categoriesWithSubcategories: RouterOutputs["expenseCategory"]["getAllWithSubcategories"];
  selectedCategory: ExpenseCategory | undefined;
  setCategory: (category: ExpenseCategory | undefined) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-between font-normal">
          {selectedCategory ? (
            <div className="flex items-center gap-2">
              <div
                className="size-4 rounded-full"
                style={{ backgroundColor: selectedCategory.color }}
              />
              {selectedCategory.name}
            </div>
          ) : (
            <Muted>Select category</Muted>
          )}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder="Search category..." className="h-9" />
          <CommandList>
            <CommandEmpty>No subcategory found.</CommandEmpty>
            {categoriesWithSubcategories.map((category) => (
              <CommandItem
                key={category.id}
                value={String(category.id)}
                onSelect={() => {
                  setCategory(category);
                  setOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="size-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  {category.name}
                </div>
                <Check
                  className={cn(
                    "ml-auto",
                    selectedCategory?.id === category.id
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
