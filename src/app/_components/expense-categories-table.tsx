"use client";

import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Edit2, Trash2 } from "lucide-react";
import { Fragment } from "react/jsx-runtime";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

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
                  <Edit2 size={14} />
                  <Trash2 size={14} />
                </div>
              </TableCell>
            </TableRow>
            <TableRow className="hover:bg-inherit">
              <TableCell />
              <TableCell colSpan={colsCount - 1} className="p-0">
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
                    {category.subcategories.map((subcategory) => (
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
              </TableCell>
            </TableRow>
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
};
