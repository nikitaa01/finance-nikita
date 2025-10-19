import type { LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/app/_components/ui/sidebar";
import { SectionLink } from "./links/section-link";

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
          <SectionLink key={item.name} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
