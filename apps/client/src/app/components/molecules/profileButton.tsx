import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { useEnterprise } from "providers/enterprise-provider";
import { cn } from "../../../lib/utils";

type ProfileButtonProps = {
  className: string;
};

export default function ProfileButton({ className }: ProfileButtonProps) {
  const { enterprise } = useEnterprise();

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
        <DropdownMenuItem>Se déconnecter</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
