import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { cn } from "../../../lib/utils";
import { EnterpriseInfo } from "../../../types/enterprise-info-type";

type ProfileButtonProps = {
  className: string;
  enterprise: EnterpriseInfo | null;
};

export default async function ProfileButton({
  className,
  enterprise,
}: ProfileButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            "bg-primary rounded-md text-white py-3 px-2 flex items-center justify-between",
            className
          )}
        >
          <span className="font-semibold text-sm w-1/2">
            {enterprise?.name}
          </span>
          <p className="text-sm mr-2 font-light">{enterprise?.sales} €</p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[250px]">
        <DropdownMenuLabel>{enterprise?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Se déconnecter</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
