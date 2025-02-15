import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { cn } from "../../../lib/utils";

type ProfileButtonProps = {
  className: string;
};

export default function ProfileButton({ className }: ProfileButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            "bg-primary rounded-md text-white py-3 px-2 flex items-center justify-between",
            className
          )}
        >
          <span className="font-semibold text-sm">Proxiad Axe Seine</span>
          <p className="text-sm mr-2 font-light">331 222 €</p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[250px]">
        <DropdownMenuLabel>Proxiad Axe Seine</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Se déconnecter</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
