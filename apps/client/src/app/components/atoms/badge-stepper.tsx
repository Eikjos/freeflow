import { cn } from "../../../lib/utils";

type BadgeStepperProps = {
  number: number;
  label: string;
  active: boolean;
};

const BadgeStepper = ({ number, label, active }: BadgeStepperProps) => {
  return (
    <div className="flex flex-col">
      <div
        className={cn(
          "flex flex-row justify-center items-center bg-[#E1CEBE] rounded-full w-20 h-20",
          {
            "bg-primary": active,
          }
        )}
      >
        <span className="font-amica font-semibold text-4xl text-center">
          {number}
        </span>
      </div>
      <span className="text-center text-md w-20 mt-2">{label}</span>
    </div>
  );
};

export default BadgeStepper;
