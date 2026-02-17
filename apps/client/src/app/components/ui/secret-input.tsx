'use client'

import { Eye, EyeOff } from 'lucide-react'
import { forwardRef, useState } from 'react'
import { cn } from '../../../lib/utils'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form'
import { InputProps } from './input'

type SecretInputProps = Omit<InputProps, 'type'>

const SecretInput = forwardRef<HTMLInputElement, SecretInputProps>(
  ({ className, ...props }, ref) => {
    const [visible, setVisible] = useState(false)

    const changeVisibility = () => {
      setVisible((prev) => !prev)
    }

    return (
      <FormField
        name={props.name ?? ''}
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>{props.label}</FormLabel>
            <FormControl>
              <div className="relative flex flex-row">
                <input
                  type={visible ? 'text' : 'password'}
                  className={cn(
                    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-basefile:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[1px] focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                    { 'border-destructive text-destructive': fieldState.error },
                    className,
                  )}
                  {...props}
                  {...field}
                  ref={ref}
                />
                <span
                  onClick={changeVisibility}
                  className="absolute top-3 right-2"
                >
                  {visible ? (
                    <EyeOff size={20} color="#CBD5E1" />
                  ) : (
                    <Eye size={20} color="#CBD5E1" />
                  )}
                </span>
              </div>
            </FormControl>
            <FormDescription>{props.description}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      ></FormField>
    )
  },
)
SecretInput.displayName = 'SecretInput'

export { SecretInput }
