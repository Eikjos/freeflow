'use client';

import SidebarNav from '@components/atoms/sidebar-nav';
import Logo from '@components/molecules/logo';
import ProfileButton from '@components/molecules/profileButton';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from '@components/ui/sidebar';

type SidebarMenuProps = {
  className?: string;
};

export default function SidebarMenuCustomer({ className }: SidebarMenuProps) {
  const navLinks = [
    {
      name: 'Mes projects',
      url: '/customers/projects',
    },
    {
      name: 'Mes factures',
      url: '/customers/invoices',
    },
  ];

  return (
    <Sidebar className={className}>
      <SidebarHeader className="mb-20">
        <Logo href="/customers/dashboard" />
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
        <ProfileButton className="mx-3 mb-2" type="customer" />
        <p className="text-[10px] text-center my-2">CGU - FreeFlow - 2025</p>
      </SidebarFooter>
    </Sidebar>
  );
}
