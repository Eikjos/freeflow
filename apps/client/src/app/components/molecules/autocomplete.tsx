"use client";

import { cn } from "../../../lib/utils";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { HttpResponse } from "../../../types/http-response";
import { PaginationFilter, PaginationResult } from "@repo/shared-types";
import Loading from "@components/ui/loading";
import {
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from "@components/ui/form";
import { InputProps } from "@components/ui/input";

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
  className,
  value,
  error,
}: AutoCompleteWithoutControlProps<TData>) {
  const [open, setOpen] = useState<boolean>(false);
  const [currentValue, setCurrentValue] = useState<number | undefined>(value);
  const [displayValue, setDisplayValue] = useState<string>("");

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
    setOpen(false);
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
          value={displayValue}
        />
        <span
          className="absolute top-3 right-2 cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <ChevronUp size={20} className="text-gray-500" />
          ) : (
            <ChevronDown size={20} className="text-gray-500" />
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
