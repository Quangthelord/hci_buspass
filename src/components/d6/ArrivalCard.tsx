import type { BusRouteData } from '../../data/busRoutes'
import { formatDelayStatus, formatRouteLabel } from '../../lib/formatVi'

export function ArrivalCard({
  route,
  destination,
  minutes,
  onTime,
  active,
  onSelect,
}: {
  route: BusRouteData
  destination: string
  minutes: number
  onTime: boolean
  active?: boolean
  onSelect?: () => void
}) {
  const Tag = onSelect ? 'button' : 'div'

  return (
    <Tag
      type={onSelect ? 'button' : undefined}
      onClick={onSelect}
      className={`d6-arrival-card w-full rounded-lg border-2 text-left transition-colors ${
        active ? 'd6-arrival-card--active' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="d6-arrival-route font-bold">
          {formatRouteLabel(route.id)} → {destination}
        </p>
        <span
          className={`d6-status-pill shrink-0 rounded-full px-3 py-1 font-semibold ${
            onTime ? 'd6-status-pill--ontime' : 'd6-status-pill--delayed'
          }`}
        >
          {onTime ? 'Đúng lịch ✓' : formatDelayStatus(route.currentDelay)}
        </span>
      </div>
      <p className="d6-arrival-eta mt-2 flex items-center gap-2 font-bold tabular-nums">
        <span className="d6-eta-dot" aria-hidden />
        {minutes} phút
      </p>
    </Tag>
  )
}
