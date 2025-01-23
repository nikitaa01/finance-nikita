"use client";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const SectionLink = ({
  item,
}: {
  item: {
    name: string;
    url: string;
    icon: LucideIcon;
  };
}) => {
  const pathname = usePathname() ?? "/";

  return (
    <SidebarMenuItem key={item.name}>
      <SidebarMenuButton asChild isActive={pathname === item.url}>
        <Link href={item.url}>
          <item.icon />
          <span>{item.name}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
