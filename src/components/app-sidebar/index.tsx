import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { getUser } from "@/server/services/auth/get-user";
import { Suspense } from "react";
import { DashboardLink } from "./links/dashboard-link";
import { DailyActionsSection } from "./sections/daily-actions-section";
import { SettingsSection } from "./sections/setting-section";
import { SidebarProfile } from "./sidebar-profile";

export async function AppSidebar({}) {
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
        <Suspense
          fallback={
            <SidebarProfile name={"loading"} email={"loading@example.com"} />
          }
        >
          <SidebarProfileServerWrapper />
        </Suspense>
      </SidebarFooter>
    </Sidebar>
  );
}

async function SidebarProfileServerWrapper() {
  const user = await getUser();

  return (
    <SidebarProfile
      email={user.email}
      name={user.name}
      image={user.image ?? undefined}
    />
  );
}
