import type { ReactNode } from 'react'
import { useMobileScroll } from '../../hooks/useMobileScroll'

export function MobileShell({
  children,
  badge,
  className = '',
}: {
  children: ReactNode
  badge?: string
  className?: string
}) {
  useMobileScroll()

  return (
    <div className={`min-h-dvh bg-gradient-to-b from-green-50 to-white ${className}`}>
      {badge && (
        <p className="sticky top-0 z-10 bg-neon-green/10 px-4 py-2 text-center text-xs font-medium text-neon-green">
          {badge}
        </p>
      )}
      <div className="mobile-scroll-pad mx-auto w-full max-w-lg">{children}</div>
    </div>
  )
}
