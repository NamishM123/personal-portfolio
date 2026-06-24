import * as React from 'react'

export function LeafGlyph({
  className,
  size = 16,
  strokeWidth = 1.4,
  ...rest
}: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      {...rest}
    >
      <path d="M3 21c4-8 8-13 18-19-1 11-6 17-13 18-2 .3-3.5-.6-5 1z" />
      <path d="M3 21c5-7 9-11 16-15" />
    </svg>
  )
}

export function BranchRule({ className }: { className?: string }) {
  return (
    <div className={`ornament-rule ${className ?? ''}`} aria-hidden>
      <span className="line" />
      <LeafGlyph size={14} className="opacity-70" />
      <span className="line" />
    </div>
  )
}
