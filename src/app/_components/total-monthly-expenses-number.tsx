"use client";
import { useTRPC } from "@/trpc/react";
import { H1 } from "./ui/typography";

import { useSuspenseQuery } from "@tanstack/react-query";

const priceFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

export const TotalMonthlyExpensesNumber = () => {
  const api = useTRPC();
  const { data: totalMonthlyExpenses } = useSuspenseQuery(
    api.expense.getTotalMonthlyExpenses.queryOptions(),
  );
  return <H1>{priceFormatter.format(totalMonthlyExpenses)}</H1>;
};
