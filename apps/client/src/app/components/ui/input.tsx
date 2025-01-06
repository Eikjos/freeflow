import { ComponentProps, forwardRef } from "react";
import { cn } from "../../../lib/utils";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";

export type InputProps = Omit<ComponentProps<"input">, "name"> & {
  name: string;
  description?: string;
  label?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <FormField
        name={props.name}
        render={({ field, fieldState }) => (
          <FormItem className={cn(className)}>
            <FormLabel>{props.label}</FormLabel>
            <FormControl>
              <input
                type={type}
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-basefile:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[1px] focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                  { "border-destructive text-destructive": fieldState.error }
                )}
                {...props}
                {...field}
                ref={ref}
              />
            </FormControl>
            <FormDescription>{props.description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      ></FormField>
    );
  }
);
Input.displayName = "Input";

export { Input };
