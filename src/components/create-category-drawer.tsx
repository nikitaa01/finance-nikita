"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ReactElement } from "react";

export const CreateCategoryDrawer = ({
  trigger,
  triggerAsChild,
}: {
  trigger: ReactElement;
  triggerAsChild?: boolean;
}) => {
  return (
    <Drawer>
      <DrawerTrigger asChild={triggerAsChild}>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="max-w-screen-sm mx-auto w-full">
          <DrawerTitle>Create category</DrawerTitle>
          <DrawerDescription>
            Fill in the form below to create a new category.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="max-w-screen-sm mx-auto w-full">
          <Button>Submit</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
