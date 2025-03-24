"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { InputProps } from "@components/ui/input";
import Loading from "@components/ui/loading";
import { PaginationFilter, PaginationResult } from "@repo/shared-types";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { createRef, useEffect, useState } from "react";
import { cn } from "../../../lib/utils";
import { HttpResponse } from "../../../types/http-response";

type AutoCompleteProps<TData extends Record<string, string | number>> =
  {} & AutoCompleteWithoutControlProps<TData> &
    Omit<InputProps, "type" | "value" | "defaultValue">;

type AutoCompleteWithoutControlProps<
  TData extends Record<string, string | number>,
> = {
  queryOptions: (
    filter: PaginationFilter<TData>
  ) => UseQueryOptions<HttpResponse<PaginationResult<TData>>, Error>;
  filterField: keyof TData;
  fieldIdentifier: keyof TData;
  render: (data: TData) => string;
  value?: number;
  className?: string;
  placeholder?: string;
  error?: string;
} & Omit<InputProps, "type" | "value" | "defaultValue">;

type AutocompleteItemProps = {
  name: string;
  value: number;
  onClick: (value: number, displayValue: string) => void;
};

function AutoCompleteItem({ name, value, onClick }: AutocompleteItemProps) {
  return (
    <div
      className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
      onClick={() => onClick(value, name)}
    >
      <span>{name}</span>
    </div>
  );
}

function AutoCompleteWithoutControl<
  TData extends Record<string, string | number>,
>({
  queryOptions,
  filterField,
  fieldIdentifier,
  render,
  placeholder,
  value,
  error,
}: AutoCompleteWithoutControlProps<TData>) {
  const [open, setOpen] = useState<boolean>(false);
  const [currentValue, setCurrentValue] = useState<number | undefined>(value);
  const [displayValue, setDisplayValue] = useState<string>("");
  const inputRef = createRef<HTMLInputElement>();

  const [filterApplied, setFilterApplied] = useState<PaginationFilter<TData>>({
    page: 0,
    pageSize: 20,
    filter: value
      ? ({ [fieldIdentifier]: value } as Partial<TData>)
      : ({} as Partial<TData>),
    asc: filterField,
  });

  const handleChange = (newValue: number, newDisplayValue: string) => {
    setCurrentValue(newValue);
    setDisplayValue(newDisplayValue);
    handleFilter(newDisplayValue);
    setOpen(false);
  };

  const handleClear = () => {
    setCurrentValue(undefined);
    setDisplayValue("");
    handleFilter("");
    inputRef.current?.focus();
  };

  const handleFilter = (value: string) => {
    const updatedFilter: Partial<TData> = {};

    updatedFilter[filterField] = value as TData[keyof TData];
    setDisplayValue(value);
    setFilterApplied((prev) => ({
      ...prev,
      filter: updatedFilter,
      asc: filterField,
    }));
  };

  const { data, isLoading } = useQuery({ ...queryOptions(filterApplied) });

  useEffect(() => {
    if (
      data &&
      data.ok &&
      currentValue === value &&
      filterApplied.filter &&
      filterApplied.filter[fieldIdentifier] !== undefined
    ) {
      if (data?.data?.data[0]) setDisplayValue(render(data?.data?.data[0]));
    }
  }, [data]);

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
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          value={displayValue}
          ref={inputRef}
        />
        <span
          className="absolute top-3 right-2 cursor-pointer"
          onClick={() => setOpen(!open)}
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
        <div className="absolute max-h-40 z-50 rounded-md shadow-md w-full bg-white overflow-y-auto">
          <div className="flex flex-col w-full">
            {isLoading ? (
              <div className="flex flex-row justify-center py-2">
                <Loading />
              </div>
            ) : data && data.ok && data.data?.data.length ? (
              data.data.data.map((item, index) => (
                <AutoCompleteItem
                  name={render(item)}
                  value={item[fieldIdentifier] as number}
                  onClick={handleChange}
                  key={index}
                />
              ))
            ) : (
              <div className="px-2 py-1 text-gray-500">
                Aucun résultat trouvé
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Autocomplete<
  TData extends Record<string, string | number>,
>({ ...props }: AutoCompleteProps<TData>) {
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
              />
              <FormMessage />
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
