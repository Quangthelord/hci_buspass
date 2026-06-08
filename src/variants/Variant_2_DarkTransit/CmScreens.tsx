import {
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  Briefcase,
  Bus,
  Footprints,
  Grid3X3,
  MoreHorizontal,
  Navigation,
  Search,
  Share2,
  Star,
  TrainFront,
  X,
} from 'lucide-react'
import type { BusRouteData } from '../../data/busRoutes'
import { CM, TRANSPORT_MODES } from './constants'
import { CmMap } from './CmMap'
import {
  formatArriveTime,
  getArrivalMinutes,
  getDestination,
  getTripMinutes,
} from './utils'

const MODE_ICONS: Record<string, typeof Bus> = {
  grid: Grid3X3,
  walk: Footprints,
  bus: Bus,
  rail: TrainFront,
  subway: TrainFront,
  more: MoreHorizontal,
}

/* ── Home ── */
export function CmHomeScreen({
  query,
  stationName,
  onQueryChange,
  onSearchSubmit,
  onModeSelect,
  onCommuteTap,
  onSearchFocus,
}: {
  query: string
  stationName: string
  onQueryChange: (q: string) => void
  onSearchSubmit: () => void
  onModeSelect: (mode: string) => void
  onCommuteTap: () => void
  onSearchFocus: () => void
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <div className="relative h-[42vh] shrink-0">
        <CmMap variant="home" />
        <div className="absolute inset-x-4 top-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              onSearchSubmit()
            }}
            onPointerDown={onSearchFocus}
          >
            <div className="cm-search-pill flex items-center gap-3 px-5 py-3.5">
              <Search className="h-5 w-5 text-[#9CA3AF]" />
              <input
                type="search"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Get Me Somewhere"
                className="min-w-0 flex-1 border-none bg-transparent text-base outline-none placeholder:text-[#9CA3AF]"
              />
            </div>
          </form>
        </div>
      </div>

      <div className="shrink-0 px-4 py-3">
        <p className="mb-2 text-sm font-semibold text-[#6B7280]">Get Me Home</p>
        <div className="flex gap-3">
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white py-3 text-sm font-semibold shadow-sm"
          >
            <Briefcase className="h-5 w-5 text-[#37B24D]" />
            Work
          </button>
          <button
            type="button"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white py-3 text-sm font-semibold shadow-sm"
          >
            <Star className="h-5 w-5 text-[#37B24D]" />
            Places
          </button>
        </div>
      </div>

      <div className="cm-mode-grid shrink-0">
        <div className="grid grid-cols-6 gap-1">
          {TRANSPORT_MODES.map((m) => {
            const Icon = MODE_ICONS[m.icon] ?? Grid3X3
            const active = m.id === 'bus'
            return (
              <button
                key={m.id}
                type="button"
                className={`cm-mode-btn ${active ? 'cm-mode-btn--active' : ''}`}
                onClick={() => onModeSelect(m.id)}
              >
                <span className={`cm-mode-icon ${active ? 'text-[#37B24D]' : 'text-white'}`}>
                  <Icon className="h-5 w-5" />
                </span>
                {m.label}
              </button>
            )
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={onCommuteTap}
        className="mx-4 mb-4 mt-auto shrink-0 rounded-2xl border border-[#E5E7EB] bg-white p-4 text-left shadow-md"
      >
        <p className="mb-1 flex items-center gap-2 text-xs font-semibold text-[#6B7280]">
          <span>🟢</span> Commute
        </p>
        <div className="flex items-center justify-between">
          <p className="text-base font-bold text-[#1A1A1A]">
            To Suối Tiên from {stationName} &gt;
          </p>
          <div className="text-right">
            <p className="text-xs text-[#6B7280]">Arrive</p>
            <p className="font-bold tabular-nums">{formatArriveTime(35)}</p>
          </div>
        </div>
        <p className="mt-1 text-sm text-[#6B7280]">Next departures from {stationName}</p>
      </button>
    </div>
  )
}

/* ── Journey planner ── */
export function CmPlannerScreen({
  start,
  end,
  suggestions,
  onBack,
  onSwap,
  onSelectRoute,
  onEndChange,
  onSearchFocus,
}: {
  start: string
  end: string
  suggestions: BusRouteData[]
  onBack: () => void
  onSwap: () => void
  onSelectRoute: (r: BusRouteData) => void
  onEndChange: (q: string) => void
  onSearchFocus: () => void
}) {
  const busRoute = suggestions.find((r) => r.id === '01') ?? suggestions[0]
  const busMins = busRoute ? getTripMinutes(busRoute) : 35

  return (
    <div className="flex min-h-dvh flex-col" style={{ background: CM.slate }}>
      <div className="shrink-0 px-3 pt-3">
        <button type="button" onClick={onBack} className="mb-2 p-1 text-white/80">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="cm-planner-header">
          <div className="flex gap-3">
            <div className="min-w-0 flex-1 space-y-3">
              <div>
                <p className="text-xs text-white/60">Start</p>
                <p className="font-semibold">{start}</p>
                <p className="text-xs text-white/50">Bến Thành Bus Terminal</p>
              </div>
              <div onPointerDown={onSearchFocus}>
                <p className="text-xs text-white/60">End</p>
                <input
                  value={end}
                  onChange={(e) => onEndChange(e.target.value)}
                  className="w-full border-none bg-transparent text-lg font-semibold text-white outline-none placeholder:text-white/40"
                  placeholder="Where to?"
                />
              </div>
            </div>
            <button type="button" onClick={onSwap} className="self-center p-2 text-white/70" aria-label="Swap">
              <ArrowLeftRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-2 px-3 py-3">
        {[
          { label: 'Walk', time: '52 min', extra: '210 cal', icon: Footprints },
          { label: 'Bus', time: `${busMins} min`, extra: 'live', icon: Bus, live: true },
          { label: 'Metro', time: '41 min', extra: '', icon: TrainFront },
          { label: 'Combo', time: `${busMins + 8} min`, extra: 'Bus+Walk', icon: Navigation },
        ].map((item) => {
          const Icon = item.icon
          return (
            <div key={item.label} className="rounded-xl bg-white p-3 shadow-sm">
              <div className="flex items-start justify-between">
                <Icon className="h-5 w-5 text-[#6B7280]" />
                {item.live && <span className="cm-live-signal text-sm">📡</span>}
              </div>
              <p className="mt-2 text-sm font-semibold">{item.label}</p>
              <p className="text-lg font-bold">{item.time}</p>
              {item.extra && <p className="text-xs text-[#6B7280]">{item.extra}</p>}
            </div>
          )
        })}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto rounded-t-2xl bg-[#2D3A4F] px-3 pb-6 pt-4">
        <p className="mb-3 text-sm font-bold text-white">Suggested</p>
        <div className="space-y-2">
          {suggestions.map((route) => {
            const mins = getTripMinutes(route)
            const dest = getDestination(route)
            const wait = getArrivalMinutes(route)
            return (
              <button
                key={route.id}
                type="button"
                onClick={() => onSelectRoute(route)}
                className="cm-suggested-card flex w-full items-center gap-3 p-4 text-left"
              >
                <span className="cm-bus-pill">{route.id}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[#1A1A1A]">Bus → {dest}</p>
                  <p className="text-sm text-[#6B7280]">
                    in {wait}, {wait + 10} min from {start}
                  </p>
                </div>
                <span className="shrink-0 text-lg font-bold tabular-nums">{mins} min</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ── Route detail ── */
export function CmRouteDetailScreen({
  route,
  stationName,
  onBack,
  onGo,
  onStopClick,
}: {
  route: BusRouteData
  stationName: string
  onBack: () => void
  onGo: () => void
  onStopClick: (id: string) => void
}) {
  const mins = getTripMinutes(route)
  const wait = getArrivalMinutes(route)
  const dest = getDestination(route)
  const arrive = formatArriveTime(mins)

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <div className="relative h-[40vh] shrink-0">
        <CmMap variant="route" busProgress={0.25} />
        <div className="absolute left-3 top-3 flex gap-2">
          <button type="button" onClick={onBack} className="cm-fab" aria-label="Back">
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button type="button" className="cm-fab"><Share2 className="h-4 w-4" /></button>
          <button type="button" className="cm-fab"><Star className="h-4 w-4" /></button>
          <button type="button" className="cm-fab"><Navigation className="h-4 w-4" /></button>
        </div>
        <div className="absolute bottom-4 right-4">
          <button type="button" onClick={onGo} className="cm-go-btn flex items-center gap-2">
            GO <ArrowRight className="h-5 w-5" />
          </button>
        </div>
        <div className="absolute bottom-4 left-4 rounded-md bg-[#37B24D] px-2 py-1 text-xs font-bold text-white">
          Start
        </div>
      </div>

      <div className="shrink-0 border-b border-[#E5E7EB] px-4 py-3">
        <div className="flex items-center gap-2">
          <Footprints className="h-5 w-5 text-[#2A81F6]" />
          <span className="cm-bus-pill text-sm">{route.id}</span>
          <span className="text-xl font-bold">{mins} min</span>
        </div>
        <p className="mt-1 text-sm text-[#6B7280]">
          Leave within {Math.max(1, wait)} min · Arrive {arrive}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        <div className="mb-4 rounded-xl border border-[#E5E7EB] p-4">
          <div className="flex items-center gap-2">
            <Footprints className="h-5 w-5 text-[#2A81F6]" />
            <p className="font-bold">Walk to <strong>{stationName}</strong></p>
            <span className="ml-auto font-bold">2 min</span>
          </div>
          <div className="cm-best-exit mt-3 flex items-center gap-2">
            <span className="text-lg">🚪</span>
            <div>
              <p className="text-xs font-semibold text-[#37B24D]">Best Entrance</p>
              <p className="text-sm font-semibold">Phan Chu Trinh, NE corner</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] p-4">
          <div className="flex items-center gap-2">
            <span className="cm-bus-pill">{route.id}</span>
            <p className="font-bold">Bus — towards {dest}</p>
          </div>
          <div className="cm-eta-bubble relative z-10 -mt-2 mb-3 ml-8 inline-flex items-center gap-1">
            <span className="cm-live-signal">📡</span>
            <span className="text-2xl font-bold">in {wait} min</span>
          </div>
          <ul className="space-y-2">
            {route.stops.map((stop, i) => (
              <li key={stop.id}>
                <button
                  type="button"
                  onClick={() => onStopClick(stop.id)}
                  className="flex w-full items-center gap-3 rounded-lg py-2 text-left"
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      i === 0 ? 'border-[#37B24D] bg-[#37B24D]' : 'border-[#D1D5DB] bg-white'
                    }`}
                  />
                  <span className={i === route.stops.length - 1 ? 'font-bold' : ''}>{stop.name}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="cm-best-exit mt-3 flex items-center gap-2">
            <span className="text-lg">🚌</span>
            <div>
              <p className="text-xs font-semibold text-[#37B24D]">Best Section — Middle</p>
              <p className="text-sm text-[#6B7280]">Stand near middle doors for Suối Tiên exit</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── GO navigation ── */
export function CmGoModeScreen({
  route,
  onClose,
  onStopClick,
}: {
  route: BusRouteData
  onClose: () => void
  onStopClick: (id: string) => void
}) {
  const dest = getDestination(route)
  const stops = route.stops
  const rideStops = Math.max(1, stops.length - 1)

  return (
    <div className="relative flex min-h-dvh flex-col">
      <div className="absolute inset-0">
        <CmMap variant="go" busProgress={0.55} />
      </div>

      <div className="absolute left-3 top-3 z-10">
        <div className="cm-go-alert flex items-center gap-2">
          <span>⏰</span>
          Board bus {route.id}
        </div>
      </div>
      <button type="button" onClick={onClose} className="cm-fab absolute right-3 top-3 z-10" aria-label="Close">
        <X className="h-5 w-5 text-red-500" />
      </button>

      <div className="mt-auto rounded-t-2xl bg-white shadow-2xl">
        <div className="flex justify-center gap-1 pt-3">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === 1 ? 'bg-[#37B24D]' : 'bg-[#D1D5DB]'}`} />
          ))}
        </div>
        <div className="px-4 py-4">
          <div className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-[#37B24D]" />
            <p className="flex-1 font-bold">
              Ride {rideStops} stops to <span className="cm-bus-pill mx-1 text-sm">{route.id}</span> {dest}
            </p>
            <span className="font-bold">{getTripMinutes(route)} min</span>
          </div>

          <div className="relative mt-4 pl-4">
            <div className="cm-timeline-line" />
            <ul className="space-y-3">
              {stops.map((stop, i) => (
                <li key={stop.id} className="relative flex items-center gap-3">
                  <span className={`cm-timeline-dot ${i === 2 ? 'cm-timeline-dot--current' : ''}`} />
                  <button
                    type="button"
                    onClick={() => onStopClick(stop.id)}
                    className={`text-left ${i === stops.length - 1 ? 'font-bold text-[#37B24D]' : ''}`}
                  >
                    {stop.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-[#6B7280]">
            <Footprints className="h-4 w-4" />
            Leave station · 1 min
          </div>

          <div className="cm-best-exit mt-3">
            <p className="text-xs font-semibold text-[#6B7280]">Best Exit</p>
            <p className="font-semibold text-[#37B24D]">Suối Tiên Station, main gate</p>
          </div>
        </div>
      </div>
    </div>
  )
}
