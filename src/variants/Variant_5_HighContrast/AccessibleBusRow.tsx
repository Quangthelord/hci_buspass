import { ArrowRight } from 'lucide-react'
import type { BusRouteData } from '../../data/busRoutes'
import { A11Y, BODY_STYLE, TOUCH_MIN } from './constants'
import { getArrivalMinutes, getBusStatus, getDestination } from './busStatus'

export function AccessibleBusRow({
  index,
  route,
  onSelect,
  destination: destinationOverride,
  minutes: minutesOverride,
}: {
  index: number
  route: BusRouteData
  onSelect: () => void
  destination?: string
  minutes?: number | null
}) {
  const status = getBusStatus(route)
  const minutes = minutesOverride !== undefined ? minutesOverride : getArrivalMinutes(route)
  const destination = destinationOverride ?? getDestination(route)
  const statusStyle = A11Y.status[status]

  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className="flex w-full items-stretch border-2 text-left"
        style={{
          minHeight: TOUCH_MIN,
          borderColor: A11Y.border,
          backgroundColor: A11Y.bg,
          color: A11Y.text,
          ...BODY_STYLE,
        }}
        aria-label={`Tuyến ${route.id} đến ${destination}, ${minutes !== null ? `${minutes} phút` : 'thời gian chưa rõ'}`}
      >
        <span
          className="flex shrink-0 items-center justify-center border-r-2 px-4"
          style={{
            minWidth: TOUCH_MIN,
            minHeight: TOUCH_MIN,
            borderColor: A11Y.border,
            fontSize: '20px',
          }}
          aria-hidden
        >
          {index}
        </span>

        <span className="flex min-w-0 flex-1 flex-col justify-center gap-1 px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
          <span className="flex min-w-0 flex-1 items-center gap-3">
            <span style={{ fontSize: '28px', lineHeight: 1.1 }}>Tuyến {route.id}</span>
            <ArrowRight
              className="h-6 w-6 shrink-0"
              strokeWidth={2}
              aria-hidden
            />
            <span className="min-w-0 truncate" style={{ fontSize: '22px', lineHeight: 1.2 }}>
              {destination}
            </span>
          </span>

          <span
            className="shrink-0 tabular-nums"
            style={{ fontSize: '36px', lineHeight: 1 }}
          >
            {minutes !== null ? (
              <>
                {minutes}
                <span style={{ fontSize: '20px' }}> phút</span>
              </>
            ) : (
              <span style={{ fontSize: '20px' }}>—</span>
            )}
          </span>
        </span>

        <span
          className="flex shrink-0 items-center border-l-2 px-4"
          style={{
            minHeight: TOUCH_MIN,
            borderColor: A11Y.border,
            backgroundColor: statusStyle.bg,
            color: statusStyle.text,
            fontSize: '20px',
          }}
        >
          {statusStyle.label}
        </span>
      </button>
    </li>
  )
}
