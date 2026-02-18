'use client';

import { cva, VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { CalendarIcon } from 'lucide-react';
import { ComponentProps } from 'react';
import { Matcher } from 'react-day-picker';
import { cn } from '../../../lib/utils';
import { Button } from './button';
import { Calendar } from './calendar';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export type DateInputProps = Omit<
  ComponentProps<'input'>,
  'name' | 'max' | 'min'
> & {
  name?: string;
  description?: string;
  label?: string;
  maxDate?: Date;
  minDate?: Date;
  error?: string; // Ajout pour les erreurs sans react-hook-form
} & VariantProps<typeof inputVariant>;

const inputVariant = cva(
  'flex h-10 w-full rounded-md text-base file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
  {
    variants: {
      variant: {
        default:
          'border border-input bg-background focus-visible:outline-none focus-visible:ring-[1px] focus-visible:ring-primary px-3 py-2',
        ghost: 'bg-transparent py-0 px-2 m-0 w-full text-inherit',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export function DateInput({
  name,
  label,
  placeholder,
  className,
  minDate,
  maxDate,
  ...props
}: DateInputProps) {
  const disbledDate: Matcher[] = [];
  if (minDate) {
    disbledDate.push({
      before: minDate,
    });
  }
  if (maxDate) {
    disbledDate.push({
      after: maxDate,
    });
  }

  return (
    <FormField
      name={name!}
      render={({ field }) => (
        <FormItem className={clsx('flex flex-col', className)}>
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={'outline'}
                  className={cn(
                    'pl-3 text-left font-normal',
                    !field.value && 'text-muted-foreground',
                  )}
                >
                  {field.value ? (
                    dayjs(field.value as Date).format('DD/MM/YYYY')
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value as Date}
                onSelect={(value) => {
                  field.onChange(value);
                  field.onBlur();
                }}
                disabled={disbledDate}
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>
          {props.description && (
            <FormDescription>{props.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
