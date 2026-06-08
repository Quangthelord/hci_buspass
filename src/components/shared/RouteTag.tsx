const SIZE_CLASS = {
  sm: 'h-8 min-w-8 px-2 text-sm',
  md: 'h-10 min-w-10 px-3 text-base',
  lg: 'h-14 min-w-14 px-4 text-xl',
} as const

export function RouteTag({
  routeId,
  color,
  size = 'md',
}: {
  routeId: string
  color: string
  size?: keyof typeof SIZE_CLASS
}) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg font-bold text-white shadow-sm ${SIZE_CLASS[size]}`}
      style={{ backgroundColor: color }}
    >
      {routeId}
    </span>
  )
}
