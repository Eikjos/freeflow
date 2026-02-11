"use client";

import { useCallback } from "react";


type StarButtonProps = {
  readOnly: boolean;
  displayValue: number;
  index: number;
  size: number;
  setHoverValue: (value: number) => void;
  handleSet: (value: number) => void;
}


export default function StarButton({readOnly, displayValue, index, size, setHoverValue, handleSet } : StarButtonProps) { 
  // how much of this star is filled (0 to 100)
  const rawFill = Math.max(0, Math.min(1, (displayValue - index)))
  const fillPercent = Math.round(rawFill * 100)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (readOnly) return
    const target = e.currentTarget as HTMLButtonElement
    const rect = target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const demiRectWidth = rect.width / 2;
    let selected = 0;
    if (x >= demiRectWidth) {
      selected = index + 1;
    } else {
      selected = index + 0.5;
    }
    setHoverValue(selected)
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (readOnly) return
    // use hoverValue if present
    const target = e.currentTarget as HTMLButtonElement
    const rect = target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const demiRectWidth = rect.width / 2;
    let selected = 0;
    if (x >= demiRectWidth) {
      selected = index + 1;
    } else {
      selected = index + 0.5;
    }
    handleSet(selected)
  }

  return (
    <button
      type="button"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      aria-label={`${index} star`}
      className={`p-1 bg-transparent border-0 outline-none focus:outline-none focus-visible:outline-none`}
      style={{ width: size, height: size }}
    >
      <StarIcon size={size} fillPercent={fillPercent} id={`star-${index}`} />
    </button>
  )
}

function StarIcon({ size = 28, fillPercent = 100, id }: { size?: number; fillPercent?: number, id: string }) {
  const viewBox = '0 0 24 24'
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="inline-block align-middle"
    >
      <defs>
        <linearGradient id={id} x1="0" x2="1">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <clipPath id={`clip-${id}`}>
          <rect x="0" y="0" width={`${(fillPercent / 100) * 24}`} height="24" />
        </clipPath>
      </defs>

      {/* outline */}
      <path
        d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.788 1.402 8.173L12 18.896 4.664 23.171l1.402-8.173L.132 9.21l8.2-1.192z"
        fill="#e6e7e9"
      />

      {/* filled portion clipped */}
      <g clipPath={`url(#clip-${id})`}>
        <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.788 1.402 8.173L12 18.896 4.664 23.171l1.402-8.173L.132 9.21l8.2-1.192z" fill={`url(#${id})`} />
      </g>

      {/* subtle stroke */}
      <path
        d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.788 1.402 8.173L12 18.896 4.664 23.171l1.402-8.173L.132 9.21l8.2-1.192z"
        fill="none"
        stroke="#cbd5e1"
        strokeWidth="0.6"
      />
    </svg>
  )
}