import type { ReactNode } from 'react'

export function MobileShell({
  children,
  badge,
  className = '',
}: {
  children: ReactNode
  badge?: string
  className?: string
}) {
  return (
    <div className={`min-h-screen bg-gradient-to-b from-green-50 to-white ${className}`}>
      {badge && (
        <p className="bg-neon-green/10 px-4 py-2 text-center text-xs font-medium text-neon-green">{badge}</p>
      )}
      <div className="mx-auto w-full max-w-lg">{children}</div>
    </div>
  )
}
