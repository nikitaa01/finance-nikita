import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu
} from "@/components/ui/sidebar";
import { SectionButton } from "./buttons/section-button";

export function SectionLinks({
  links,
  title,
}: {
  links: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
  title: string;
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {links.map((item) => (
          <SectionButton key={item.name} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
