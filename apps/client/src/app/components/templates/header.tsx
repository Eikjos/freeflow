import Logo from "@components/molecules/logo";
import { Button } from "@components/ui/button";
import Link from "next/link";

type HeaderProps = {
  displayMenu: boolean;
}

export default function Header({ displayMenu = false } : HeaderProps) {
  return (
    <div className="pl-3 bg-card container rounded-full border border-secondary mt-10 mx-auto flex flew-row justify-between sticky">
      <div className="w-52">
        <Logo />
      </div>
      <div className="flex flex-row items-center pr-10 gap-10">
        {displayMenu && (
          <ul className="flex flex-row items-center gap-4">
            <li>
              <Link href={"/#features"}>
                Fonctionnalités
              </Link>
            </li>
            <li>
              <Link href={"/#tarifs"}>
                Tarifs
              </Link>
            </li>
          </ul>
        )}
        {/* Gérer le cas de la connexion */}
        <Button className="rounded-full" asChild>
          <Link href="/login">
            Se connecter
          </Link>
        </Button>
      </div>

    </div>
  );
}
