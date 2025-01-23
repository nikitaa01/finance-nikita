import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Suspense } from "react";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense>
      <SidebarProvider>
        <AppSidebar />
        <main className="min-h-dvh w-full space-y-4 px-8 py-4">
          <SidebarTrigger />
          <Suspense>{children}</Suspense>
        </main>
      </SidebarProvider>
    </Suspense>
  );
}
