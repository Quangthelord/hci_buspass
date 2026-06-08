import { ArrowLeft, Bell, Bus } from 'lucide-react'
import type { BusRouteData } from '../../data/busRoutes'
import { MtHeader } from './MtHeader'
import { MtSearchBar } from './MtSearchBar'
import { MtOccupancyLegend } from './MtArrivalRow'
import { LOAD_LABEL } from './constants'
import { formatArrivalLabel, getArrivalMinutes, getDestination, getLoadLevel } from './utils'

export function RouteDetail({
  route,
  onBack,
  onStopClick,
}: {
  route: BusRouteData
  onBack: () => void
  onStopClick: (target: string) => void
}) {
  const destination = getDestination(route)
  const minutes = getArrivalMinutes(route, 0)
  const load = getLoadLevel(route.currentDelay, 0)
  const busProgress = Math.min(85, (minutes / 20) * 100)

  return (
    <div className="mt-sg-root flex min-h-dvh flex-col bg-[#F5F5F5]">
      <MtHeader />

      <div className="shrink-0 px-4 pb-3 pt-3">
        <button
          type="button"
          onClick={() => {
            onStopClick('detail-back')
            onBack()
          }}
          className="mb-3 flex items-center gap-1 text-sm font-semibold text-[#009B3A]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to stop
        </button>
        <MtSearchBar value="" onChange={() => {}} placeholder="Search along this route" />
      </div>

      {/* Map + live bus — MyTransport bus arrival screen */}
      <div className="relative min-h-[38vh] shrink-0">
        <div className="mt-sg-map absolute inset-0">
          <div className="mt-sg-map-route" />
          <div
            className="mt-sg-map-bus"
            style={{ left: `${busProgress}%`, top: '42%' }}
            aria-label="Bus location"
          >
            <Bus className="h-4 w-4" />
          </div>
          <p className="absolute bottom-3 left-4 rounded-md bg-white/90 px-2 py-1 text-xs font-semibold text-[#1976D2] shadow-sm">
            Live bus location
          </p>
        </div>
      </div>

      {/* Bottom sheet */}
      <div className="mt-sg-sheet flex min-h-0 flex-1 flex-col">
        <div className="mt-sg-sheet-handle" aria-hidden />

        <div className="border-b border-[#EEEEEE] px-4 py-3">
          <div className="flex items-start gap-3">
            <span className="mt-sg-service-badge">{route.id}</span>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-[#212121]">Towards {destination}</h2>
              <p className="text-sm text-[#757575]">{route.name}</p>
              <div className="mt-2 flex items-center gap-3">
                <p
                  className="text-2xl font-bold"
                  style={{
                    color: load === 'seats' ? '#00A651' : load === 'standing' ? '#F57F17' : '#E53935',
                  }}
                >
                  {formatArrivalLabel(minutes)}
                </p>
                <span className="text-sm text-[#757575]">{LOAD_LABEL[load]}</span>
                <button type="button" className="ml-auto text-[#9E9E9E]" aria-label="Notify me">
                  <Bell className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-2">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#757575]">Route stops</p>
          <ul className="space-y-1">
            {route.stops.map((stop, i) => {
              const isFirst = i === 0
              const isLast = i === route.stops.length - 1
              return (
                <li key={stop.id}>
                  <button
                    type="button"
                    onClick={() => onStopClick(`stop-${stop.id}`)}
                    className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left hover:bg-[#F1F8F4]"
                  >
                    <span
                      className={`mt-sg-stop-marker ${isFirst ? 'mt-sg-stop-marker--current' : ''} ${isLast ? 'mt-sg-stop-marker--end' : ''}`}
                    >
                      {isLast ? 'B' : isFirst ? 'A' : i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[#212121]">{stop.name}</p>
                      <p className="text-sm text-[#757575]">
                        ETA ~{stop.nextArrival + route.currentDelay} min
                      </p>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <MtOccupancyLegend />
      </div>
    </div>
  )
}
