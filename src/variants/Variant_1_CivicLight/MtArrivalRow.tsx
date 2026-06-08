import { Bell, Bus, Accessibility } from 'lucide-react'
import type { BusRouteData } from '../../data/busRoutes'
import { LOAD_LABEL, MT, type LoadLevel } from './constants'
import { formatArrivalLabel, getArrivalMinutes, getDestination, getLoadLevel } from './utils'

function LoadBar({ level }: { level: LoadLevel }) {
  return <div className={`mt-sg-load-bar mt-sg-load-bar--${level}`} title={LOAD_LABEL[level]} />
}

function ArrivalSlot({
  minutes,
  level,
  faded,
}: {
  minutes: number
  level: LoadLevel
  faded?: boolean
}) {
  return (
    <div className={`min-w-[4.5rem] ${faded ? 'opacity-50' : ''}`}>
      <p className={`mt-sg-arrival-time mt-sg-arrival-time--${level}`}>
        {formatArrivalLabel(minutes)}
      </p>
      <LoadBar level={level} />
    </div>
  )
}

export function MtArrivalRow({
  route,
  onSelect,
}: {
  route: BusRouteData
  onSelect: () => void
}) {
  const destination = getDestination(route)
  const bus1 = getArrivalMinutes(route, 0)
  const bus2 = getArrivalMinutes(route, 1)
  const load1 = getLoadLevel(route.currentDelay, 0)
  const load2 = getLoadLevel(route.currentDelay, 1)

  const timelineMax = 15
  const pos1 = Math.min(95, (bus1 / timelineMax) * 100)
  const pos2 = Math.min(95, (bus2 / timelineMax) * 100)

  return (
    <button type="button" onClick={onSelect} className="mt-sg-arrival-row w-full px-4 py-3 text-left">
      <div className="flex items-start gap-3">
        <span className="mt-sg-service-badge shrink-0">{route.id}</span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-base font-bold text-[#212121]">{destination}</p>
              <p className="truncate text-sm text-[#757575]">{route.name}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 text-[#9E9E9E]">
              {route.id === '01' && (
                <Accessibility className="h-4 w-4 text-[#1976D2]" aria-label="Wheelchair accessible" />
              )}
              <Bell className="h-4 w-4" aria-hidden />
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-4">
            <ArrivalSlot minutes={bus1} level={load1} />
            <ArrivalSlot minutes={bus2} level={load2} faded />
          </div>

          <div className="mt-sg-timeline" aria-hidden>
            <div className="mt-sg-timeline-grid" />
            <span
              className="mt-sg-timeline-bus"
              style={{ left: `${pos1}%` }}
              title={`${bus1} min`}
            >
              <Bus className="h-3.5 w-3.5" />
            </span>
            <span
              className="mt-sg-timeline-bus mt-sg-timeline-bus--fade"
              style={{ left: `${pos2}%` }}
              title={`${bus2} min`}
            >
              <Bus className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}

export function MtOccupancyLegend() {
  const items: { level: LoadLevel; color: string }[] = [
    { level: 'seats', color: MT.loadSeats },
    { level: 'standing', color: MT.loadStanding },
    { level: 'limited', color: MT.loadLimited },
  ]

  return (
    <div className="mt-sg-legend flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-2">
      {items.map((item) => (
        <span key={item.level} className="flex items-center gap-1.5">
          <span className="mt-sg-legend-dot" style={{ backgroundColor: item.color }} />
          {LOAD_LABEL[item.level]}
        </span>
      ))}
    </div>
  )
}
