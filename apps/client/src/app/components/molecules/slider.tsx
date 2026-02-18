'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '../../../lib/utils';

type SliderProps = {
  children: React.ReactNode;
  autoSlide: boolean;
  autoSlideInterval: number;
  className?: string;
};

export default function Slider({
  children,
  autoSlide = true,
  autoSlideInterval = 3000,
  className,
}: SliderProps) {
  const [current, setCurrent] = useState(0);
  const length = React.Children.count(children);
  let timeoutRef: NodeJS.Timeout;

  const nextSlide = () =>
    setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));

  useEffect(() => {
    if (!autoSlide) return;
    const play = () => {
      timeoutRef = setTimeout(nextSlide, autoSlideInterval);
    };
    play();
    return () => clearTimeout(timeoutRef);
  }, [current, autoSlide, autoSlideInterval]);

  return (
    <div className={cn('relative w-full h-full overflow-hidden', className)}>
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {React.Children.map(children, (child) => (
          <div className="w-full flex-shrink-0">{child}</div>
        ))}
      </div>
      {/* Indicateurs "points" style mobile */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {Array.from({ length }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 w-2 rounded-full transition-all shadow-lg border-gray-400 border ${
              current === index ? 'bg-primary' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
