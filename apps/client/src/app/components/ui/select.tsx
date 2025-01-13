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

export type SelectItem<T> = {
  value: T;
  name: string;
};

export type SelectProps<T> = Omit<ComponentProps<"select">, "name"> & {
  name: string;
  description?: string;
  placeholder?: string;
  label?: string;
  values: SelectItem<T>[];
};

const Select = forwardRef<HTMLSelectElement, SelectProps<number>>(
  (
    { values, name, description, className, label, placeholder, ...props },
    ref
  ) => {
    return (
      <FormField
        name={name}
        render={({ field, fieldState }) => (
          <FormItem className={cn(className)}>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <select
                className={cn(
                  "select h-10 w-full px-3 py-2 rounded-md border border-input bg-background text-basefile:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[1px] focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                  { "border-destructive text-destructive": fieldState.error }
                )}
                {...props}
                {...field}
                ref={ref}
              >
                {placeholder && <option value="">{placeholder}</option>}
                {values.map((elem, index) => (
                  <option value={elem.value} key={index}>
                    {elem.name}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormDescription>{description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      ></FormField>
    );
  }
);

export default Select;
