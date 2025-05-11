"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { colors } from "@/constants/colors";
import type { Errors } from "@/server/actions/category/create-category-action";
import { handleCreateCategoryAction } from "@/server/actions/category/create-category-action";
import type { CategoryWithTags } from "@/stores/categories-store";
import { useCategoriesStore } from "@/stores/categories-store";
import type { ActionState } from "@/types/action-state";
import { Loader2, Plus } from "lucide-react";
import type { Dispatch, ReactElement, SetStateAction } from "react";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

function useUpdateCategoriesOnSuccess({
  state,
  setOpen,
}: {
  state: typeof initialState;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const addCategoryWithTags = useCategoriesStore(
    (state) => state.addCategoryWithTags,
  );

  useEffect(() => {
    if (state.status === "success") {
      addCategoryWithTags(state.data.categoryWithTags);
      toast.success(state.data.message);
      setOpen(false);
    }
  }, [state, addCategoryWithTags, setOpen]);

  return null;
}

const initialState: ActionState<
  {
    categoryWithTags: CategoryWithTags;
    message: string;
  },
  Errors
> = {
  status: "not-started",
};

export function CreateCategoryDrawer({
  trigger,
  triggerAsChild,
}: {
  trigger: ReactElement;
  triggerAsChild?: boolean;
}) {
  const [state, action, pending] = useActionState(
    handleCreateCategoryAction,
    initialState,
  );
  const errors = state.status === "error" ? state.errors : {};

  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [color, setColor] = useState("");

  useUpdateCategoriesOnSuccess({ state, setOpen });

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild={triggerAsChild}>{trigger}</DrawerTrigger>
      <DrawerContent>
        <form action={action} className="mx-auto w-full max-w-screen-sm">
          <DrawerHeader>
            <DrawerTitle>Create New Category</DrawerTitle>
            <DrawerDescription>
              Add a new category to your list.
            </DrawerDescription>
          </DrawerHeader>
          <CategoryForm
            name={name}
            setName={setName}
            color={color}
            setColor={setColor}
            errors={errors}
          />
          <ActionButtons pending={pending} />
        </form>
      </DrawerContent>
    </Drawer>
  );
}

interface CategoryFormProps {
  name: string;
  setName: (name: string) => void;
  color: string;
  setColor: (color: string) => void;
  errors: Errors;
}

export function CategoryForm({
  name,
  setName,
  color,
  setColor,
  errors,
}: CategoryFormProps) {
  return (
    <div className="p-4 pb-0">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            name="name"
            autoComplete="off"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name"
          />
          {errors?.name && (
            <p className="text-xs text-red-400">{errors?.name}</p>
          )}
        </div>
        <ColorPicker color={color} setColor={setColor} errors={errors} />
      </div>
    </div>
  );
}

interface ColorPickerProps {
  color: string;
  setColor: (color: string) => void;
  errors: Errors;
}

export function ColorPicker({ color, setColor, errors }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <Label>Color</Label>
      <div className="grid grid-cols-[repeat(8,1fr)] place-content-between gap-3 sm:grid-cols-[repeat(16,1fr)]">
        {colors.map(({ name, hex }) => (
          <label
            key={name}
            className="group/radio-color aspect-square cursor-pointer rounded-full "
          >
            <input
              onChange={(e) => setColor(e.target.value)}
              checked={color === hex}
              className="hidden"
              type="radio"
              name="color"
              value={hex}
            />
            <div
              className="size-full rounded-full ring-white/75 transition hover:ring-4 group-has-[input:checked]/radio-color:ring-4 group-has-[input:checked]/radio-color:ring-white"
              style={{ backgroundColor: hex }}
            />
          </label>
        ))}
      </div>
      {errors?.color && <p className="text-xs text-red-400">{errors?.color}</p>}
    </div>
  );
}

interface ActionButtonsProps {
  pending: boolean;
}

export function ActionButtons({ pending }: ActionButtonsProps) {
  return (
    <DrawerFooter>
      <Button type="submit" disabled={pending}>
        {pending ? <Loader2 className="animate-spin" /> : <Plus />}
        Create Category
      </Button>
      <DrawerClose asChild>
        <Button variant="outline">Cancel</Button>
      </DrawerClose>
    </DrawerFooter>
  );
}
