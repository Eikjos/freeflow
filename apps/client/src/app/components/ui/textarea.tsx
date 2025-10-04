import * as React from "react";

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

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea"> & { label?: string; description?: string }
>(({ className, name, label, description, ...props }, ref) => {
  return name ? (
    <FormField
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <textarea
              className={cn(
                "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                className,
                { "border-destructive text-destructive": fieldState.error }
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
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
