import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
} from "@/app/_components/ui/sidebar";
import { api } from "@/trpc/server";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import { DashboardLink } from "./links/dashboard-link";
import { DailyActionsSection } from "./sections/daily-actions-section";
import { SettingsSection } from "./sections/setting-section";
import { SidebarProfile } from "./sidebar-profile";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <DashboardLink />
      </SidebarHeader>
      <SidebarContent>
        <DailyActionsSection />
        <SettingsSection />
      </SidebarContent>
      <SidebarFooter>
        <Suspense fallback={<SidebarSkeletonProfile />}>
          <SidebarProfileServerWrapper />
        </Suspense>
      </SidebarFooter>
    </Sidebar>
  );
}

function SidebarSkeletonProfile() {
  return (
    <SidebarMenuButton
      size="lg"
      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
    >
      <Avatar className="size-8 rounded-lg">
        <AvatarFallback className="rounded-lg">
          <Skeleton className="size-full" />
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-1 h-3 w-32" />
      </div>
    </SidebarMenuButton>
  );
}

async function SidebarProfileServerWrapper() {
  const user = await api.user.getUser();

  return (
    <SidebarProfile
      email={user.email}
      name={user.name}
      image={user.image ?? undefined}
    />
  );
}
