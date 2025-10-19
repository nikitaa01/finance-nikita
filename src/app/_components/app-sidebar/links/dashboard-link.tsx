"use client";

import { SidebarMenuButton } from "@/app/_components/ui/sidebar";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const DashboardLink = () => {
  const pathname = usePathname();

  return (
    <SidebarMenuButton
      asChild
      isActive={pathname === "/"}
      size="lg"
      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
    >
      <Link href="/">
        <LayoutDashboard />
        Dashboard
      </Link>
    </SidebarMenuButton>
  );
};
