import { AppSidebar } from "../_components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "../_components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1 px-6 py-2">
          <SidebarTrigger />
          <main>{children}</main>
        </div>
      </SidebarProvider>
    </div>
  );
}
