import { ArrowLeft } from 'lucide-react'
import type { BusRouteData } from '../../data/busRoutes'
import { A11Y, BODY_STYLE, TOUCH_MIN } from './constants'
import { getArrivalMinutes, getBusStatus, getDestination } from './busStatus'

export function RouteDetail({
  route,
  onBack,
}: {
  route: BusRouteData
  onBack: () => void
}) {
  const status = getBusStatus(route)
  const statusStyle = A11Y.status[status]
  const minutes = getArrivalMinutes(route)
  const destination = getDestination(route)

  return (
    <div
      className="flex min-h-dvh flex-col font-sans"
      style={{ backgroundColor: A11Y.bg, color: A11Y.text, ...BODY_STYLE }}
    >
      <header className="border-b-2 px-5 py-4" style={{ borderColor: A11Y.border }}>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-3"
          style={{ minHeight: TOUCH_MIN, minWidth: TOUCH_MIN, color: A11Y.text }}
        >
          <ArrowLeft className="h-6 w-6" strokeWidth={2} aria-hidden />
          <span>Quay lại</span>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-6">
        <h1 style={{ fontSize: '32px', lineHeight: 1.2, marginBottom: '1rem' }}>
          Tuyến {route.id}
        </h1>

        <p style={{ fontSize: '22px', marginBottom: '0.5rem' }}>
          Hướng: {destination}
        </p>

        <p
          className="inline-block border-2 px-4 py-2"
          style={{
            borderColor: A11Y.border,
            backgroundColor: statusStyle.bg,
            color: statusStyle.text,
            marginBottom: '1.5rem',
          }}
        >
          {statusStyle.label}
          {minutes !== null && ` — ${minutes} phút`}
          {route.delayReason && ` — ${route.delayReason}`}
        </p>

        <h2
          className="border-b-2 pb-2"
          style={{ borderColor: A11Y.border, fontSize: '22px', marginBottom: '1rem' }}
        >
          Các trạm dừng
        </h2>

        <ol className="space-y-0">
          {route.stops.map((stop, i) => (
            <li
              key={stop.id}
              className="border-2 border-t-0 px-4 py-4 first:border-t-2"
              style={{ borderColor: A11Y.border }}
            >
              <p style={{ fontSize: '22px' }}>
                <span style={{ marginRight: '0.75rem' }}>{i + 1}.</span>
                {stop.name}
              </p>
              {i === 0 && minutes !== null && (
                <p style={{ marginTop: '0.25rem' }}>Xe đến sau {minutes} phút</p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
