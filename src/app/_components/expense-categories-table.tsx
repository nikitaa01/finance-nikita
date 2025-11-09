"use client";

import type { ExpenseCategory } from "@/server/db/schemas/expense-category";
import type { ExpenseSubcategory } from "@/server/db/schemas/expense-subcategory";
import { useTRPC } from "@/trpc/react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Small } from "./ui/typography";

export const ExpenseCategoriesTable = () => {
  const trpc = useTRPC();
  const { data: categoriesWithSubcategories } = useSuspenseQuery(
    trpc.expenseCategory.getAllWithSubcategories.queryOptions(),
  );

  const colsCount = 4;

  return (
    <Table className="max-w-md overflow-hidden rounded-md">
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Color</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {categoriesWithSubcategories.map((category) => (
          <Fragment key={category.id}>
            <ExpenseCategoryRow category={category} />
            {category.subcategories.length > 0 && (
              <TableRow className="hover:bg-inherit">
                <TableCell />
                <TableCell colSpan={colsCount - 1} className="p-0">
                  <ExpenseSubcategoriesTable
                    subcategories={category.subcategories}
                  />
                </TableCell>
              </TableRow>
            )}
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

function ExpenseCategoryRow({ category }: { category: ExpenseCategory }) {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const { mutate: updateCategory } = useMutation(
    trpc.expenseCategory.update.mutationOptions(),
  );
  const { mutate: deleteCategory } = useMutation(
    trpc.expenseCategory.delete.mutationOptions({
      onSuccess: () => {
        queryClient.setQueryData(
          trpc.expenseCategory.getAllWithSubcategories.queryKey(),
          (old) => (!old ? old : old.filter((c) => c.id !== category.id)),
        );
        queryClient.invalidateQueries(
          trpc.expenseCategory.getAllWithSubcategories.pathFilter(),
        );
      },
    }),
  );

  return (
    <TableRow>
      <TableCell>{category.id}</TableCell>
      <TableCell>{category.name}</TableCell>
      <TableCell>
        {
          <div
            style={{ backgroundColor: category.color }}
            className="size-4 rounded-full"
          />
        }
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2 />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-3xs">
              <div className="flex flex-col gap-2">
                <Small className="text-pretty">
                  Are you sure you want to delete this category?
                </Small>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteCategory({ id: category.id })}
                >
                  Delete
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </TableCell>
    </TableRow>
  );
}

function ExpenseSubcategoriesTable({
  subcategories,
}: { subcategories: ExpenseSubcategory[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Color</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {subcategories.map((subcategory) => (
          <TableRow key={subcategory.id}>
            <TableCell>{subcategory.id}</TableCell>
            <TableCell>{subcategory.name}</TableCell>
            <TableCell>
              <div
                style={{ backgroundColor: subcategory.color }}
                className="size-4 rounded-full"
              />
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-end gap-2">
                <Edit2 size={14} />
                <Trash2 size={14} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
