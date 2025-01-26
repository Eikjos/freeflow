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
import { Label } from "./label";

export type InputProps = Omit<ComponentProps<"input">, "name"> & {
  name?: string;
  description?: string;
  label?: string;
  error?: string; // Ajout pour les erreurs sans react-hook-form
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, name, description, label, error, ...props }, ref) => {
    const hasError = !!error;

    return name ? (
      <FormField
        name={name}
        render={({ field, fieldState }) => (
          <FormItem className={cn(className)}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <input
                type={type}
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[1px] focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                  {
                    "border-destructive text-destructive": fieldState.error,
                  }
                )}
                {...props}
                {...field}
                ref={ref}
              />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
    ) : (
      <div className={cn(className)}>
        {label && <Label>{label}</Label>}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[1px] focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            {
              "border-destructive text-destructive": hasError,
            }
          )}
          {...props}
          ref={ref}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
