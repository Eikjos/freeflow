"use client";

import StarButton from '@components/atoms/star-button';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../../../lib/utils';

interface StarRatingProps {
  value?: number // current rating (can be fractional)
  defaultValue?: number
  readOnly?: boolean
  onChange?: (value: number) => void
  className?: string
}

export default function StarRating({
  value: controlledValue,
  defaultValue = 0,
  readOnly = false,
  onChange,
  className = '',
}: StarRatingProps) {
  const isControlled = controlledValue !== undefined
  const [value, setValue] = useState<number>(controlledValue ?? defaultValue)
  const [hoverValue, setHoverValue] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const max = 5

  useEffect(() => {
    if (isControlled) setValue(controlledValue)
  }, [controlledValue])

  const handleSet = (newVal: number) => {
    if (readOnly) return
    if (!isControlled) setValue(newVal)
    onChange?.(newVal)
  }

  const displayValue = hoverValue ?? value

  return (
    <div
      ref={containerRef}
      className={cn('flex flex-col items-center', className)}
    >
      <div className="font-medium text-primary text-3xl" aria-hidden>
        {value.toString().replace('.', ',')} / {max}
      </div>
      <div
        aria-label={readOnly ? `Note: ${value} sur ${max}` : `Note : ${value} sur ${max}`}
        aria-valuemin={0}
        aria-valuemax={max}
        tabIndex={readOnly ? -1 : 0}
        onMouseLeave={() => setHoverValue(null)}
        className={`inline-flex select-none outline-none rounded ${readOnly ? '' : 'cursor-pointer'}`}
      >
        {Array.from({ length: max }).map((_, i) => (
          <StarButton size={25} index={i} key={i} readOnly={readOnly} displayValue={displayValue} setHoverValue={setHoverValue} handleSet={handleSet}  />
        ))}
      </div>
    </div>
  )
}

