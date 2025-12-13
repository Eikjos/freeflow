import { cn } from "../../../lib/utils";

type FooterProps = {
  className?: string;
};

export default function Footer({ className }: FooterProps) {
  return (
    <div
      className={cn(
        "flex flex-row justify-center bg-card p-5 border-t-2 border-secondary mt-16",
        className
      )}
    >
      <p className="text-sm">@Freeflow - CGU - 2025</p>
    </div>
  );
}
