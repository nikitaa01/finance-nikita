"use client";

import type { ExpenseCategory } from "@/server/db/schemas/expense-category";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { colors } from "../_constants/colors";
import { Button } from "./ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "./ui/field";
import { Input } from "./ui/input";

export function AddExpenseCategoryForm({
  onSuccess,
}: {
  onSuccess: (category: ExpenseCategory | undefined) => void;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { mutate: createCategory, isPending } = useMutation(
    trpc.expenseCategory.create.mutationOptions({
      onSettled: () => {
        queryClient.invalidateQueries(trpc.expenseCategory.pathFilter());
      },
      onSuccess,
    }),
  );

  const [name, setName] = useState<string>("");
  const [selectedColor, setColor] = useState<string | undefined>(undefined);

  const handleSubmit = () => {
    if (name === "" || selectedColor === undefined) {
      return;
    }

    createCategory({
      name,
      color: selectedColor,
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
              placeholder="e.g. Housing"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
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
          Category
        </Button>
      </FieldSet>
    </form>
  );
}
