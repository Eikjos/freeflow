import NotFoundEnterprise from "(pages)/(enterprise)/not-found";
import SidebarMenuCustomer from "@components/templates/sidebar-menu-customer";
import { SidebarProvider } from "@components/ui/sidebar";
import { headers } from "next/headers";
import { CustomerProvider } from "providers/customer-provider";
import { CustomerInfo } from "../../../types/customer-info-type";
export default async function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersCustomer = (await headers()).get("x-customer");

  if (!headersCustomer) {
    return <NotFoundEnterprise />;
  }

  const customer: CustomerInfo = JSON.parse(headersCustomer);

  return (
    <CustomerProvider initialCustomer={customer}>
      <SidebarProvider>
        <SidebarMenuCustomer />
        <div className="px-5 pb-2 pt-7 w-full overflow-auto">{children}</div>
      </SidebarProvider>
    </CustomerProvider>
  );
}
