import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CategoryTag } from "@/server/db/schema/category-tag";

export const EditableTag = ({ color, id, name }: CategoryTag) => {
  return (
    <DropdownMenu key={id}>
      <DropdownMenuTrigger>
        <Badge style={{ backgroundColor: color }}>{name}</Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent>{name}</DropdownMenuContent>
    </DropdownMenu>
  );
};
