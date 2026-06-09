import type { BusRouteData } from '../../data/busRoutes'
import { formatDelayStatus, formatRouteLabel } from '../../lib/formatVi'

export function ArrivalCard({
  route,
  destination,
  minutes,
  onTime,
  active,
  lang = 'vi',
  onSelect,
}: {
  route: BusRouteData
  destination: string
  minutes: number
  onTime: boolean
  active?: boolean
  lang?: 'vi' | 'en'
  onSelect?: () => void
}) {
  const Tag = onSelect ? 'button' : 'div'
  const isVi = lang === 'vi'

  return (
    <Tag
      type={onSelect ? 'button' : undefined}
      onClick={onSelect}
      className={`d6-arrival-card w-full rounded-xl border-2 text-left transition-colors ${
        active ? 'd6-arrival-card--active' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="d6-arrival-route truncate font-semibold">
            {formatRouteLabel(route.id)} → {destination}
          </p>
          <span
            className={`d6-status-pill mt-1.5 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
              onTime ? 'd6-status-pill--ontime' : 'd6-status-pill--delayed'
            }`}
          >
            {onTime ? (isVi ? 'Đúng lịch ✓' : 'On time ✓') : formatDelayStatus(route.currentDelay)}
          </span>
        </div>
        <p className="d6-arrival-eta flex shrink-0 items-center gap-1.5 font-bold tabular-nums">
          <span className="d6-eta-dot" aria-hidden />
          {minutes}′
        </p>
      </div>
    </Tag>
  )
}
