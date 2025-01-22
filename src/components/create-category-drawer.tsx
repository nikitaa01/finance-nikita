"use client"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { colors } from "@/constants/colors"
import { handleCreateCategoryAction } from "@/server/actions/category/create-category-action"
import { Plus } from "lucide-react"
import type { ReactElement } from "react"
import { useRef, useState } from "react"

export function CreateCategoryDrawer({ trigger, triggerAsChild }: {
  trigger: ReactElement;
  triggerAsChild?: boolean;
}) {
  const [open, setOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleCreateCategory = async () => {
    if (!formRef.current) {
      console.log("Form not found")

      return
    }
    const formData = new FormData(formRef.current)
    const name = formData.get("name")
    const color = formData.get("color")

    if (!name || !color) {
      return
    }

    const data = await handleCreateCategoryAction({ color: String(color), name: String(name) })
    console.log(data)
    setOpen(false)
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild={triggerAsChild}>
        {trigger}
      </DrawerTrigger>
      <DrawerContent>
        <form ref={formRef} action={handleCreateCategory} className="mx-auto w-full max-w-screen-sm">
          <DrawerHeader>
            <DrawerTitle>Create New Category</DrawerTitle>
            <DrawerDescription>Add a new category to your list.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  name="name"
                  autoComplete="off"
                  placeholder="Enter category name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="grid grid-cols-[repeat(8,1fr)] place-content-between gap-2 sm:grid-cols-[repeat(16,1fr)]">
                  {colors.map(({ name, hex }) => (
                    <label key={name} className="group/radio-color aspect-square">
                      <input className="hidden" type="radio" name="color" value={hex} />
                      <div
                        className="size-full cursor-pointer rounded-full transition group-has-[input:checked]/radio-color:ring-2 group-has-[input:checked]/radio-color:ring-white"
                        style={{ backgroundColor: hex }}
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <Button type="submit">
              <Plus />
              Create Category
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}

