import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader
} from "@/components/ui/sidebar";
import { getUser } from "@/server/services/auth/get-user";
import { DashboardButton } from "./buttons/dashboard-button";
import { DailyActionsSection } from "./sections/daily-actions-section";
import { SettingsSection } from "./sections/setting-section";
import { SidebarProfile } from "./sidebar-profile";

export async function AppSidebar({ }) {
  const user = await getUser();

  return (
    <Sidebar>
      <SidebarHeader>
        <DashboardButton />
      </SidebarHeader>
      <SidebarContent>
        <DailyActionsSection />
        <SettingsSection />
      </SidebarContent>
      <SidebarFooter>
        <SidebarProfile user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
