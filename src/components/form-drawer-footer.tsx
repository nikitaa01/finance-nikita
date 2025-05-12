import { Loader2, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "./ui/button";
import { DrawerClose, DrawerFooter } from "./ui/drawer";

interface FormDrawerFooterProps {
  pending: boolean;
  children: ReactNode;
}

export function FormDrawerFooter({ pending, children }: FormDrawerFooterProps) {
  return (
    <DrawerFooter>
      <Button type="submit" disabled={pending}>
        {pending ? <Loader2 className="animate-spin" /> : <Plus />}
        {children}
      </Button>
      <DrawerClose asChild>
        <Button variant="outline">Cancel</Button>
      </DrawerClose>
    </DrawerFooter>
  );
}
