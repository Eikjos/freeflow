'use client';

import { SidebarMenuButton, SidebarMenuItem } from '@components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type SidebarNavProps = {
  url: string;
  name: string;
};

export default function SidebarNav({ name, url }: SidebarNavProps) {
  const pathname = usePathname();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={pathname.startsWith(url)}>
        <Link href={url} passHref>
          {name}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
