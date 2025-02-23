import SidebarNav from "@components/atoms/sidebar-nav";
import Logo from "@components/molecules/logo";
import ProfileButton from "@components/molecules/profileButton";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "@components/ui/sidebar";
import { EnterpriseInfo } from "../../../types/enterprise-info-type";

type SidebarMenuProps = {
  enterprise: EnterpriseInfo | null;
};

export default async function SidebarMenu({ enterprise }: SidebarMenuProps) {
  const navLinks = [
    {
      name: "Mes chiffres",
      url: "/enterprises",
    },
    {
      name: "Mes factures",
      url: "#",
    },
    {
      name: "Mes clients",
      url: "/customers",
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
              <SidebarNav url={link.url} name={link.name} key={index} />
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <ProfileButton className="mx-3 mb-2" enterprise={enterprise} />
        <p className="text-[10px] text-center my-2">CGU - FreeFlow - 2025</p>
      </SidebarFooter>
    </Sidebar>
  );
}
