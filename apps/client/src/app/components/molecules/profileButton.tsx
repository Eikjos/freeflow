import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { logout } from "actions/login";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEnterprise } from "providers/enterprise-provider";
import { cn } from "../../../lib/utils";

type ProfileButtonProps = {
  className: string;
};

export default function ProfileButton({ className }: ProfileButtonProps) {
  const { enterprise } = useEnterprise();
  const t = useTranslations();
  const router = useRouter();

  const onLogout = async () => {
    await logout();
    router.replace("/");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            "bg-primary rounded-md text-white py-3 px-2 flex items-center justify-between",
            className
          )}
        >
          <span className="text-sm w-1/2">{enterprise?.name}</span>
          <p className="text-sm mr-2 font-light">{enterprise?.sales} €</p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[250px]">
        <DropdownMenuLabel>{enterprise?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="hover:cursor-pointer">{t("common.logout")}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
