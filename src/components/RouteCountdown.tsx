import { useCountdown, formatCountdown, etaRangeToSeconds } from '../hooks/useCountdown'
import type { Lang } from '../data/mockData'

export function RouteCountdown({
  routeNumber,
  etaRange,
  lang,
  large = false,
}: {
  routeNumber: string
  etaRange: string
  lang: Lang
  large?: boolean
}) {
  const seconds = useCountdown(etaRangeToSeconds(etaRange))
  const label = lang === 'vi' ? 'Còn' : 'In'

  if (large) {
    return (
      <div className="text-center">
        <p className="text-lg opacity-70">
          {lang === 'vi' ? 'Tuyến' : 'Route'} {routeNumber} — {label}
        </p>
        <p className="font-mono text-7xl font-bold tabular-nums tracking-tight">
          {formatCountdown(seconds)}
        </p>
        <p className="text-sm opacity-60">
          {lang === 'vi' ? 'Đếm ngược thời gian thực' : 'Live countdown'}
        </p>
      </div>
    )
  }

  return (
    <span className="font-mono font-bold text-warning-orange tabular-nums">
      {label} {formatCountdown(seconds)}
    </span>
  )
}
