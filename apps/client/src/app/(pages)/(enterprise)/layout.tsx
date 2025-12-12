import SidebarMenu from "@components/templates/sidebar-menu";
import { SidebarProvider } from "@components/ui/sidebar";
import { headers } from "next/headers";
import { EnterpriseProvider } from "providers/enterprise-provider";
import { EnterpriseInfo } from "../../../types/enterprise-info-type";

export default async function EnterpriseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersEnterprise = (await headers()).get("x-enterprise");
  const enterprise: EnterpriseInfo | undefined = headersEnterprise
    ? JSON.parse(headersEnterprise)
    : undefined;
  return (
    <EnterpriseProvider initialEnterprise={enterprise}>
      <SidebarProvider>
        <SidebarMenu />
        <div className="px-5 pb-2 pt-7 w-full overflow-auto">{children}</div>
      </SidebarProvider>
    </EnterpriseProvider>
  );
}
