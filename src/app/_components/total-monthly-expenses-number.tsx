"use client";

import { api } from "@/trpc/react";
import { H1 } from "./ui/typography";

const priceFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

export const TotalMonthlyExpensesNumber = () => {
  const [totalMonthlyExpenses] =
    api.expense.getTotalMonthlyExpenses.useSuspenseQuery();
  return <H1>{priceFormatter.format(totalMonthlyExpenses)}</H1>;
};
