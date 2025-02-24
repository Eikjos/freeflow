import SidebarMenu from "@components/templates/sidebar-menu";
import { SidebarProvider } from "@components/ui/sidebar";
import { headers } from "next/headers";
import { EnterpriseInfo } from "../../../types/enterprise-info-type";
import "../../globals.css";

export default async function EnterpriseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersEnterprise = (await headers()).get("x-enterprise");
  const enterprise: EnterpriseInfo | null = headersEnterprise
    ? JSON.parse(headersEnterprise)
    : null;
  return (
    <SidebarProvider>
      <SidebarMenu enterprise={enterprise} />
      <div className="px-5 pb-2 pt-7 w-full">{children}</div>
    </SidebarProvider>
  );
}
