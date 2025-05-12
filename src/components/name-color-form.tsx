import { colors } from "@/constants/colors";
import type { DrawerFormErrors } from "@/types/drawer-form";
import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface NameColorFormProps {
  errors: DrawerFormErrors;
}

export function NameColorForm({ errors }: NameColorFormProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("");

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
  errors: DrawerFormErrors;
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
