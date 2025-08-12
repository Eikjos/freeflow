"use client";

import { Button } from "@components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { InputProps } from "@components/ui/input";
import Loading from "@components/ui/loading";
import { PaginationResult } from "@repo/shared-types";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "../../../lib/utils";
import { HttpResponse } from "../../../types/http-response";

type AutoCompleteProps<TData extends Record<string, unknown>> = {} & Omit<
  AutoCompleteWithoutControlProps<TData>,
  "onChange"
> &
  Omit<InputProps, "type" | "value" | "defaultValue" | "onChange">;

type AutoCompleteWithoutControlProps<TData extends Record<string, unknown>> = {
  queryOptions: (filter: {
    id?: number;
    search?: string;
  }) => UseQueryOptions<HttpResponse<PaginationResult<TData>>, Error>;
  filterField: keyof TData;
  fieldIdentifier: keyof TData;
  render: (data: TData) => string;
  value?: number;
  defaultValue?: number;
  className?: string;
  placeholder?: string;
  error?: string;
  onAdd?: () => void;
  addLabel?: string;
  onChange?: (value?: number) => void;
} & Omit<InputProps, "type" | "value" | "defaultValue" | "onChange">;

type AutocompleteItemProps = {
  name: string;
  value: number;
  onClick: (value: number, displayValue: string) => void;
};

function AutoCompleteItem({ name, value, onClick }: AutocompleteItemProps) {
  return (
    <Button
      type="button"
      variant={"select"}
      className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
      onClick={(e) => onClick(value, name)}
      tabIndex={0}
    >
      <span className="text-left">{name}</span>
    </Button>
  );
}

function AutoCompleteWithoutControl<TData extends Record<string, unknown>>({
  queryOptions,
  fieldIdentifier,
  render,
  placeholder,
  defaultValue,
  value,
  error,
  onAdd,
  addLabel,
  disabled = false,
  ...props
}: AutoCompleteWithoutControlProps<TData>) {
  const [open, setOpen] = useState<boolean>(false);
  const [currentValue, setCurrentValue] = useState<number | undefined>(
    defaultValue
  );
  const [hasTyped, setHasTyped] = useState(false);
  const [displayValue, setDisplayValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleChange = (newValue: number, newDisplayValue: string) => {
    setCurrentValue(newValue);
    setDisplayValue(newDisplayValue);
    if (props.onChange) {
      props.onChange(newValue);
    }
    setOpen(false);
  };

  const handleClear = () => {
    setCurrentValue(undefined);
    setDisplayValue("");
    if (props.onChange) {
      props.onChange();
    }
    inputRef.current?.focus();
  };

  const handleOpen = () => {
    if (!disabled) {
      setOpen((prev) => !prev);
    }
  };

  const queryParams = hasTyped
    ? { search: displayValue }
    : currentValue
      ? { id: currentValue }
      : {};

  const { data, isLoading } = useQuery({
    ...queryOptions(queryParams),
    enabled: !disabled,
  });

  const handleFilter = (value: string) => {
    setDisplayValue((prev) => value);
    setHasTyped(true);
  };

  useEffect(() => {
    if (
      data &&
      data.ok &&
      data.data?.totalItems === 1 &&
      currentValue === defaultValue &&
      currentValue !== undefined
    ) {
      if (data?.data?.data[0]) {
        setDisplayValue((prev) => render(data?.data?.data[0]!));
      }
    }
  }, [data]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className="relative flex flex-row">
        <input
          type="text"
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-basefile:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[1px] focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            {
              "border-destructive text-destructive": error,
            }
          )}
          onChange={(e) => handleFilter(e.currentTarget.value)}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          value={displayValue}
          disabled={disabled}
          ref={inputRef}
        />
        <span
          className="absolute top-3 right-2 cursor-pointer"
          onClick={handleOpen}
        >
          {currentValue === undefined && open ? (
            <ChevronUp size={20} className="text-gray-500" />
          ) : (
            <>
              {currentValue === undefined ? (
                <ChevronDown size={20} className="text-gray-500" />
              ) : (
                <X size={15} className="text-gray-500" onClick={handleClear} />
              )}
            </>
          )}
        </span>
      </div>
      {open && (
        <div
          className="absolute max-h-40 z-50 rounded-md shadow-md w-full bg-white overflow-y-auto"
          ref={dropdownRef}
          tabIndex={-1}
        >
          <div className="flex flex-col w-full">
            {isLoading ? (
              <div className="flex flex-row justify-center py-2">
                <Loading />
              </div>
            ) : data && data.ok && data.data?.data.length ? (
              <>
                {data.data.data.map((item, index) => (
                  <AutoCompleteItem
                    name={render(item)}
                    value={item[fieldIdentifier] as number}
                    onClick={handleChange}
                    key={index}
                  />
                ))}
                {onAdd && (
                  <AutoCompleteItem
                    name={addLabel!}
                    value={0}
                    onClick={() => {
                      setOpen(false);
                      onAdd();
                    }}
                  />
                )}
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant={"select"}
                  className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                  disabled
                  tabIndex={0}
                >
                  <span className="text-left">Aucun résultat trouvé</span>
                </Button>
                {onAdd && (
                  <AutoCompleteItem
                    name={addLabel!}
                    value={0}
                    onClick={onAdd}
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Autocomplete<TData extends Record<string, unknown>>({
  ...props
}: AutoCompleteProps<TData>) {
  return (
    <FormField
      name={props.name ?? ""}
      render={({ field, fieldState }) => (
        <FormItem className={cn("w-full relative", props.className)}>
          <FormLabel>{props.label}</FormLabel>
          <FormControl>
            <div>
              <AutoCompleteWithoutControl
                {...field}
                {...props}
                error={fieldState.error?.message}
                onChange={(value) => field.onChange(value)}
              />
              <FormMessage />
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
