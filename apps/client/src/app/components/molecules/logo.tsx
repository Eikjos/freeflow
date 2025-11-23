import Image from "next/image";
import Link from "next/link";
import { cn } from "../../../lib/utils";

type LogoProps = {
  className?: string;
};

export default function Logo({ className }: LogoProps) {
  return (
    <Link
      href={"/"}
      className={cn(
        "flex flew-row gap-4 justify-center items-center",
        className
      )}
    >
      <Image
        src="/assets/freeflow.png"
        width={55}
        height={55}
        alt="freeflow logo"
      />
      <span className="font-amica text-5xl">Freeflow</span>
    </Link>
  );
}
