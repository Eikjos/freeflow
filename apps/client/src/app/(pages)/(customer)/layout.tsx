import NotFoundEnterprise from "(pages)/(enterprise)/not-found";
import SidebarMenu from "@components/templates/sidebar-menu";
import { SidebarProvider } from "@components/ui/sidebar";
import { headers } from "next/headers";
import { CustomerInfo } from "../../../types/customer-info-type";
export default async function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersCustomer = (await headers()).get("x-customer");

  if (!headersCustomer) {
    return <NotFoundEnterprise />
  }

  const enterprise: CustomerInfo | undefined = headersCustomer
    ? JSON.parse(headersCustomer)
    : undefined;
  return (
      <SidebarProvider>
        <SidebarMenu />
        <div className="px-5 pb-2 pt-7 w-full overflow-auto">{children}</div>
      </SidebarProvider>
  );
}
