"use client";
import type { ExpenseSubcategory } from "@/server/db/schemas/expense-subcategory";
import { type RouterOutputs, useTRPC } from "@/trpc/react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
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

export const AddExpenseForm = ({
  onSubmit,
  CreateSubcategoryWrapper,
}: {
  onSubmit?: () => void;
  CreateSubcategoryWrapper: React.FC<{ children: React.ReactNode }>;
}) => {
  const api = useTRPC();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [subcategory, setSubcategory] = useState<
    ExpenseSubcategory | undefined
  >(undefined);
  const [errors, setErrors] = useState<{
    amount?: string;
    date?: string;
    subcategory?: string;
  }>({});
  const { mutate: createExpense, isPending } = useMutation(
    api.expense.create.mutationOptions({
      onSettled: () => {
        queryClient.invalidateQueries(api.expense.pathFilter());
      },
    }),
  );

  const validate = () => {
    const nextErrors: { amount?: string; date?: string; subcategory?: string } =
      {};
    if (amount === undefined || Number.isNaN(amount) || amount <= 0) {
      nextErrors.amount = "Amount must be a positive number";
    }
    if (!date || Number.isNaN(new Date(date).getTime())) {
      nextErrors.date = "Please select a valid date";
    }
    if (!subcategory) {
      nextErrors.subcategory = "Please choose a subcategory";
    }
    setErrors(nextErrors);
    return nextErrors;
  };

  const handleSubmit = () => {
    const nextErrors = validate();
    if (nextErrors.amount || nextErrors.date || nextErrors.subcategory) {
      return;
    }

    if (
      amount === undefined ||
      date === undefined ||
      subcategory === undefined
    ) {
      return;
    }

    onSubmit?.();

    queryClient.setQueryData(
      api.expense.getTotalMonthlyExpenses.queryKey(),
      (old?: number) => (old ?? 0) + amount,
    );

    createExpense({
      amount,
      date,
      expenseSubcategoryId: subcategory.id,
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
          <AmountField
            amount={amount}
            setAmount={(val) => {
              setAmount(val);
              setErrors((prev) => ({ ...prev, amount: undefined }));
            }}
            error={errors.amount}
          />
          <DateField
            date={date}
            setDate={(val) => {
              setDate(val);
              setErrors((prev) => ({ ...prev, date: undefined }));
            }}
            error={errors.date}
          />
          <Suspense fallback={<div>Loading...</div>}>
            <SubcategorySelectorField
              subcategory={subcategory}
              setSubcategory={(val) => {
                setSubcategory(val);
                setErrors((prev) => ({ ...prev, subcategory: undefined }));
              }}
              error={errors.subcategory}
              CreateSubcategoryWrapper={CreateSubcategoryWrapper}
            />
          </Suspense>
        </FieldGroup>
        <SubmitButton
          isPending={isPending}
          disabled={isPending || Object.values(errors).some(Boolean)}
        />
      </FieldSet>
    </form>
  );
};

function AmountField({
  amount,
  setAmount,
  error,
}: {
  amount: number | undefined;
  setAmount: (amount: number | undefined) => void;
  error?: string;
}) {
  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor="amount">Amount</FieldLabel>
      <Input
        id="amount"
        type="number"
        name="amount"
        autoComplete="off"
        placeholder="0.00"
        value={amount ?? ""}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === "") {
            setAmount(undefined);
            return;
          }
          const parsed = Number(raw);
          setAmount(Number.isNaN(parsed) ? undefined : parsed);
        }}
      />
      <FieldError>{error}</FieldError>
    </Field>
  );
}

function DateField({
  date,
  setDate,
  error,
}: {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  error?: string;
}) {
  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel>Date</FieldLabel>
      <DatePicker date={date} onSelect={setDate} />
      <FieldError>{error}</FieldError>
    </Field>
  );
}

function SubcategorySelectorField({
  CreateSubcategoryWrapper,
  subcategory: selectedSubcategory,
  setSubcategory,
  error,
}: {
  CreateSubcategoryWrapper: React.FC<{ children: React.ReactNode }>;
  subcategory: ExpenseSubcategory | undefined;
  setSubcategory: (subcategory: ExpenseSubcategory | undefined) => void;
  error?: string;
}) {
  const api = useTRPC();
  const { data: categoriesWithSubcategories } = useSuspenseQuery(
    api.expenseCategory.getAllWithSubcategories.queryOptions(),
  );

  return (
    <Field data-invalid={Boolean(error)}>
      <div className="flex justify-between">
        <FieldLabel>Subcategory</FieldLabel>
        <CreateSubcategoryWrapper>
          <AddExpenseSubcategoryForm />
        </CreateSubcategoryWrapper>
      </div>
      <CategorySelectorPopover
        categoriesWithSubcategories={categoriesWithSubcategories}
        selectedSubcategory={selectedSubcategory}
        setSubcategory={setSubcategory}
      />
      <FieldError>{error}</FieldError>
    </Field>
  );
}

function CategorySelectorPopover({
  categoriesWithSubcategories,
  selectedSubcategory,
  setSubcategory,
}: {
  categoriesWithSubcategories: RouterOutputs["expenseCategory"]["getAllWithSubcategories"];
  selectedSubcategory: ExpenseSubcategory | undefined;
  setSubcategory: (subcategory: ExpenseSubcategory | undefined) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
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
  );
}

function SubmitButton({
  isPending,
  disabled,
}: {
  isPending: boolean;
  disabled?: boolean;
}) {
  return (
    <Button type="submit" disabled={disabled}>
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
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              type="text"
              name="name"
              autoComplete="off"
              placeholder="e.g. Groceries"
            />
          </Field>

          <Field>
            <FieldLabel>Color</FieldLabel>
            <Input type="color" />
          </Field>
        </FieldGroup>
        <Button type="submit" size={"sm"}>
          <Plus /> Add Subcategory
        </Button>
      </FieldSet>
    </form>
  );
}
