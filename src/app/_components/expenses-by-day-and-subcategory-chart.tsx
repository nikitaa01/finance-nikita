"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { useTRPC } from "@/trpc/react";

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";

const currencyFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("es-ES", {
  day: "2-digit",
  month: "short",
});

const parseDateLabel = (value: string) => {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
};

const makeConfigKey = (label: string) => {
  const base = label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return base.length > 0 ? base : "subcategory";
};

export const ExpensesByDayAndSubcategoryChart = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.expense.getMonthlyExpensesByDayAndSubcategory.queryOptions(),
  );

  const { chartData, chartConfig } = (() => {
    const configEntries = new Map<string, { label: string; color: string }>();
    const nameToKey = new Map<string, string>();
    const usedKeys = new Set<string>();

    const getKeyForName = (name: string) => {
      const existing = nameToKey.get(name);
      if (existing) {
        return existing;
      }

      const baseKey = makeConfigKey(name);
      let candidate = baseKey;
      let suffix = 1;

      while (usedKeys.has(candidate)) {
        candidate = `${baseKey}-${suffix}`;
        suffix += 1;
      }

      usedKeys.add(candidate);
      nameToKey.set(name, candidate);

      return candidate;
    };

    const dataset = data.map((day) => {
      const entry: Record<string, string | number> = { date: day.date };

      for (const subcategory of day.entries) {
        const key = getKeyForName(subcategory.name);
        entry[key] = subcategory.amount;

        if (!configEntries.has(key)) {
          configEntries.set(key, {
            label: subcategory.name,
            color: subcategory.color,
          });
        }
      }

      return entry;
    });

    const config: ChartConfig = Object.fromEntries(
      Array.from(configEntries.entries()).map(([key, value]) => [
        key,
        {
          label: value.label,
          color: value.color,
        },
      ]),
    );

    return {
      chartData: dataset,
      chartConfig: config,
    };
  })();

  const categoryKeys = Object.keys(chartConfig);

  if (chartData.length === 0) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center text-muted-foreground text-sm">
        There are no expenses registered this month.
      </div>
    );
  }

  const tooltipFormatter = (
    value: number | string | Array<number | string>,
    name: string | number,
  ) => {
    const rawValue = Array.isArray(value)
      ? Number(value[0] ?? 0)
      : Number(value ?? 0);

    const formattedValue = currencyFormatter.format(
      Number.isFinite(rawValue) ? rawValue : 0,
    );

    const color = chartConfig[makeConfigKey(String(name))]?.color ?? "";

    return (
      <div className="flex items-center gap-1.5 font-medium font-mono text-foreground">
        <div
          className="size-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        {name}: {formattedValue}
      </div>
    );
  };

  return (
    <ChartContainer
      className="h-full min-h-[320px] w-full"
      config={chartConfig}
    >
      <BarChart
        data={chartData}
        margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickFormatter={parseDateLabel}
        />
        <YAxis
          tickFormatter={(value: number) => currencyFormatter.format(value)}
          width={80}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(label) => parseDateLabel(String(label))}
              formatter={tooltipFormatter}
            />
          }
        />
        <ChartLegend verticalAlign="top" content={<ChartLegendContent />} />
        {categoryKeys.map((key) => (
          <Bar
            key={key}
            dataKey={key}
            name={
              typeof chartConfig[key]?.label === "string"
                ? chartConfig[key]?.label
                : key
            }
            fill={`var(--color-${key})`}
            stackId="expenses"
            maxBarSize={24}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
};
