import SidebarMenu from "@components/templates/sidebar-menu";
import { SidebarProvider } from "@components/ui/sidebar";
import "../../globals.css";

export default async function EnterpriseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <SidebarMenu />
      {children}
    </SidebarProvider>
  );
}
