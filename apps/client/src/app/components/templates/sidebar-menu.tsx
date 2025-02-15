import Logo from "@components/molecules/logo";
import ProfileButton from "@components/molecules/profileButton";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@components/ui/sidebar";
import { headers } from "next/headers";
import Link from "next/link";

export default async function SidebarMenu() {
  const headerList = await headers();
  const pathname = headerList.get("x-current-path");
  const navLinks = [
    {
      name: "Mes chiffres",
      url: "/enterprise",
    },
    {
      name: "Mes factures",
      url: "#",
    },
    {
      name: "Mes clients",
      url: "#",
    },
    {
      name: "Mes frais",
      url: "#",
    },
    {
      name: "Mes entreprise",
      url: "#",
    },
    {
      name: "Mes tâches",
      url: "#",
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="mb-20">
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-5">
            {navLinks.map((link, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname?.startsWith(link.url)}
                >
                  <Link href={link.url} passHref>
                    {link.name}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <ProfileButton className="mx-3 mb-2" />
        <p className="text-[10px] text-center my-2">CGU - FreeFlow - 2025</p>
      </SidebarFooter>
    </Sidebar>
  );
}
