import {
  AlertTriangle,
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  Briefcase,
  Bus,
  ChevronDown,
  Footprints,
  Map,
  MapPin,
  Navigation,
  Search,
  Share2,
  Star,
  TrainFront,
  X,
  Bike,
  Zap,
} from 'lucide-react'
import type { BusRouteData } from '../../data/busRoutes'
import { HOME_MODES } from './constants'
import {
  CmBusPill,
  CmEtaBubble,
  CmIssuesBadge,
  CmLiveSignal,
  CmLogo,
  CmSuggestedRow,
  CmTrainBestSection,
} from './CmComponents'
import { CmMap, CmMapOverlayEta } from './CmMap'
import {
  formatArriveTime,
  getArrivalMinutes,
  getDestination,
  getTripMinutes,
} from './utils'

const MODE_ICON: Record<string, typeof Bus> = {
  all: Navigation,
  walk: Footprints,
  bike: Bike,
  maps: Map,
  issues: AlertTriangle,
  subway: TrainFront,
  bus: Bus,
  rail: TrainFront,
  scooter: Zap,
  more: ChevronDown,
}

function ModeIcon({ id }: { id: string }) {
  const Icon = MODE_ICON[id] ?? Bus
  return <Icon className="h-5 w-5" strokeWidth={2} />
}

/* ── Home ── */
export function CmHomeScreen({
  query,
  stationName,
  activeMode,
  onQueryChange,
  onSearchSubmit,
  onModeSelect,
  onCommuteTap,
  onSearchFocus,
}: {
  query: string
  stationName: string
  activeMode: string
  onQueryChange: (q: string) => void
  onSearchSubmit: () => void
  onModeSelect: (mode: string) => void
  onCommuteTap: () => void
  onSearchFocus: () => void
}) {
  const row1 = HOME_MODES.filter((m) => m.row === 1)
  const row2 = HOME_MODES.filter((m) => m.row === 2)

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <div className="cm-home-map">
        <CmMap variant="home" />
        <form
          className="cm-home-search"
          onSubmit={(e) => {
            e.preventDefault()
            onSearchSubmit()
          }}
          onPointerDown={onSearchFocus}
        >
          <div className="cm-search-pill flex items-center gap-3 px-5 py-3.5">
            <Search className="h-5 w-5 shrink-0 text-[#9CA3AF]" strokeWidth={2.5} />
            <input
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Get Me Somewhere"
              className="min-w-0 flex-1 border-none bg-transparent text-[1.0625rem] outline-none placeholder:text-[#9CA3AF]"
            />
          </div>
        </form>
      </div>

      <div className="cm-home-quick">
        <p className="mb-2 text-[0.8125rem] font-semibold text-[#6B7280]">Get Me Home</p>
        <div className="flex gap-2">
          <button type="button" className="cm-quick-btn">
            <Briefcase className="h-5 w-5 text-[#3CB44A]" strokeWidth={2} />
            Work
          </button>
          <button type="button" className="cm-quick-btn">
            <Star className="h-5 w-5 text-[#3CB44A]" strokeWidth={2} />
            Places
          </button>
        </div>
      </div>

      <div className="cm-mode-panel shrink-0">
        {[row1, row2].map((row, ri) => (
          <div key={ri} className={`cm-mode-grid-2 ${ri > 0 ? 'mt-2' : ''}`}>
            {row.map((m) => {
              const active = activeMode === m.id || ('default' in m && m.default && activeMode === 'bus')
              const isIssues = m.id === 'issues'
              return (
                <button
                  key={m.id}
                  type="button"
                  className={`cm-mode-btn relative ${active ? 'cm-mode-btn--active' : ''}`}
                  onClick={() => onModeSelect(m.id)}
                >
                  <span
                    className={`cm-mode-icon ${isIssues ? 'cm-mode-icon--warn' : ''} ${active ? '' : ''}`}
                  >
                    <ModeIcon id={m.id} />
                  </span>
                  {m.label}
                  {isIssues && <CmIssuesBadge />}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      <button type="button" onClick={onCommuteTap} className="cm-commute-card shrink-0">
        <div className="mb-2 flex items-center gap-2">
          <span className="cm-commute-mascot">🙂</span>
          <span className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">Commute</span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[1.0625rem] font-extrabold leading-snug text-[#1C1C1C]">
              To Suối Tiên &gt;
            </p>
            <p className="mt-0.5 text-sm text-[#6B7280]">
              Next 09:50, 10:00 from {stationName}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[0.6875rem] font-semibold uppercase text-[#9CA3AF]">Arrive</p>
            <p className="text-lg font-extrabold tabular-nums">{formatArriveTime(35)}</p>
          </div>
        </div>
      </button>
    </div>
  )
}

/* ── Planner ── */
export function CmPlannerScreen({
  start,
  end,
  suggestions,
  pref,
  onBack,
  onSwap,
  onSelectRoute,
  onEndChange,
  onPrefChange,
  onSearchFocus,
  onClearEnd,
}: {
  start: string
  end: string
  suggestions: BusRouteData[]
  pref: 'bus' | 'mrt' | 'both'
  onBack: () => void
  onSwap: () => void
  onSelectRoute: (r: BusRouteData) => void
  onEndChange: (q: string) => void
  onPrefChange: (p: 'bus' | 'mrt' | 'both') => void
  onSearchFocus: () => void
  onClearEnd: () => void
}) {
  const busRoute = suggestions.find((r) => r.id === '01') ?? suggestions[0]
  const busMins = busRoute ? getTripMinutes(busRoute) : 35

  return (
    <div className="cm-planner-shell flex min-h-dvh flex-col">
      <div className="shrink-0 px-3 pb-2 pt-3">
        <div className="mb-3 flex items-center justify-between">
          <button type="button" onClick={onBack} className="p-1 text-white/90">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <CmLogo size="sm" />
          <span className="w-6" />
        </div>

        <div className="cm-planner-card">
          <div className="flex gap-2">
            <div className="min-w-0 flex-1">
              <div className="cm-field-row">
                <span className="cm-field-icon" />
                <div className="min-w-0 flex-1">
                  <p className="text-[0.6875rem] font-semibold uppercase text-white/50">Start</p>
                  <p className="font-bold text-white">Current Location</p>
                  <p className="text-xs text-white/55">{start} · Bến Thành Terminal</p>
                </div>
              </div>
              <div className="cm-field-row" onPointerDown={onSearchFocus}>
                <span className="cm-field-icon cm-field-icon--end" />
                <div className="min-w-0 flex-1">
                  <p className="text-[0.6875rem] font-semibold uppercase text-white/50">End</p>
                  <input
                    value={end}
                    onChange={(e) => onEndChange(e.target.value)}
                    className="w-full border-none bg-transparent text-lg font-bold text-white outline-none placeholder:text-white/35"
                    placeholder="Where to?"
                  />
                </div>
                {end && (
                  <button type="button" onClick={onClearEnd} className="cm-field-clear">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            <button type="button" onClick={onSwap} className="self-center p-2 text-white/70">
              <ArrowLeftRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-2 px-3 pb-2">
        {[
          { label: 'Walk', time: '52 min', sub: '210 cal', icon: Footprints },
          { label: 'Bus', time: `${busMins} min`, sub: 'live', icon: Bus, live: true },
          { label: 'Metro', time: '41 min', sub: '', icon: TrainFront },
          { label: 'Combo', time: `${busMins + 6} min`, sub: 'Bus+Walk', icon: Navigation },
        ].map((t) => {
          const Icon = t.icon
          return (
            <div key={t.label} className="cm-mode-tile">
              <div className="flex items-start justify-between">
                <Icon className="h-5 w-5 text-[#6B7280]" />
                {t.live && <CmLiveSignal />}
              </div>
              <p className="mt-2 text-sm font-bold">{t.label}</p>
              <p className="text-xl font-extrabold tabular-nums">{t.time}</p>
              {t.sub && <p className="text-xs text-[#9CA3AF]">{t.sub}</p>}
            </div>
          )
        })}
      </div>

      <div className="cm-pref-bar">
        <span className="text-xs font-semibold text-white/60">Preference:</span>
        {(['bus', 'mrt', 'both'] as const).map((p) => (
          <button
            key={p}
            type="button"
            className={`cm-pref-chip ${pref === p ? 'cm-pref-chip--on' : ''}`}
            onClick={() => onPrefChange(p)}
          >
            {p === 'mrt' ? 'MRT' : p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      <div className="cm-suggested-list min-h-0 flex-1 overflow-y-auto">
        <p className="mb-3 px-1 text-sm font-extrabold text-white">Suggested</p>
        <div className="space-y-2">
          {suggestions.map((route) => (
            <CmSuggestedRow key={route.id} route={route} start={start} onSelect={() => onSelectRoute(route)} />
          ))}
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
  const nextWait = wait + Math.max(5, route.stops[0].nextNextArrival - route.stops[0].nextArrival)

  return (
    <div className="flex min-h-dvh flex-col bg-[#F4F5F7]">
      <div className="cm-route-map-wrap">
        <CmMap variant="route" busProgress={0.3} />
        <CmMapOverlayEta minutes={[wait, nextWait]} />

        <div className="absolute left-3 top-3">
          <button type="button" onClick={onBack} className="cm-fab">
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button type="button" className="cm-fab"><Share2 className="h-4 w-4" /></button>
          <button type="button" className="cm-fab"><Star className="h-4 w-4" /></button>
          <button type="button" className="cm-fab"><MapPin className="h-4 w-4" /></button>
        </div>
        <div className="absolute bottom-5 right-4">
          <button type="button" onClick={onGo} className="cm-go-btn flex items-center gap-2">
            GO <ArrowRight className="h-5 w-5" strokeWidth={3} />
          </button>
        </div>
      </div>

      <div className="shrink-0 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Footprints className="h-5 w-5 text-[#2A81F6]" />
          <span className="text-[#9CA3AF]">›</span>
          <CmBusPill id={route.id} />
          <span className="ml-auto text-2xl font-extrabold tabular-nums">{mins} min</span>
        </div>
        <p className="mt-1 text-sm text-[#6B7280]">
          Leave within <strong>{Math.max(1, wait)} min</strong> · Arrive <strong>{arrive}</strong>
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        <div className="cm-step-card">
          <div className="flex items-center gap-2">
            <Footprints className="h-5 w-5 text-[#2A81F6]" strokeWidth={2.5} />
            <p className="flex-1 font-bold">
              Walk to <span className="text-[#1C1C1C]">{stationName}</span>
            </p>
            <span className="font-extrabold tabular-nums">2 min</span>
          </div>
          <div className="cm-best-exit flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3CB44A]/15 text-lg">🚪</span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wide text-[#3CB44A]">Best Entrance</p>
              <p className="text-sm font-semibold">Phan Chu Trinh & 43rd, NW corner</p>
            </div>
          </div>
        </div>

        <div className="cm-step-card">
          <div className="flex items-center gap-2">
            <CmBusPill id={route.id} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="font-extrabold">Bus</p>
              <p className="text-sm text-[#6B7280]">Downtown &amp; {dest}</p>
            </div>
          </div>

          <div className="relative my-3 flex justify-center">
            <CmEtaBubble minutes={wait} large />
          </div>

          <ul className="space-y-1 border-t border-[#E8EAED] pt-3">
            {route.stops.map((stop, i) => (
              <li key={stop.id}>
                <button
                  type="button"
                  onClick={() => onStopClick(stop.id)}
                  className="flex w-full items-center gap-3 rounded-lg py-2.5 text-left"
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      i === 0
                        ? 'border-[#3CB44A] bg-[#3CB44A]'
                        : i === route.stops.length - 1
                          ? 'border-[#3CB44A] bg-white'
                          : 'border-[#D1D5DB] bg-white'
                    }`}
                  />
                  <span className={i === route.stops.length - 1 ? 'font-extrabold text-[#3CB44A]' : 'font-medium'}>
                    {stop.name}
                  </span>
                  {i > 0 && (
                    <span className="ml-auto text-xs text-[#9CA3AF]">~{stop.nextArrival}m</span>
                  )}
                </button>
              </li>
            ))}
          </ul>

          <CmTrainBestSection />
        </div>
      </div>
    </div>
  )
}

/* ── GO mode ── */
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
  const currentIdx = Math.min(2, stops.length - 2)
  const nearEnd = currentIdx >= stops.length - 2

  return (
    <div className="relative flex min-h-dvh flex-col bg-[#EEF1F4]">
      <div className="absolute inset-0">
        <CmMap variant="go" busProgress={0.62} />
      </div>

      <div className="absolute left-3 top-3 z-10">
        <div className={`cm-go-alert relative ${nearEnd ? 'cm-go-alert--speech' : ''}`}>
          {nearEnd ? '⏰ Get off now' : `⏰ Board bus ${route.id}`}
        </div>
      </div>
      {!nearEnd && (
        <div className="absolute left-3 top-16 z-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2A81F6] text-white shadow-lg">
            ⏰
          </div>
        </div>
      )}
      <button type="button" onClick={onClose} className="cm-fab absolute right-3 top-3 z-10">
        <X className="h-5 w-5 text-[#EF4444]" strokeWidth={2.5} />
      </button>

      <div className="cm-go-sheet relative z-10 mt-auto">
        <div className="cm-sheet-dots">
          <span className="cm-sheet-dot" />
          <span className="cm-sheet-dot cm-sheet-dot--on" />
          <span className="cm-sheet-dot" />
        </div>

        <div className="px-4 pb-6 pt-3">
          <div className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-[#3CB44A]" strokeWidth={2.5} />
            <p className="min-w-0 flex-1 text-[0.9375rem] font-extrabold leading-snug">
              Ride {rideStops} stops to <CmBusPill id={route.id} size="sm" /> {dest}
            </p>
            <span className="shrink-0 text-lg font-extrabold">{getTripMinutes(route)} min</span>
          </div>

          <div className="relative mt-4 pl-5">
            <div className="cm-timeline-line" />
            <ul className="space-y-3">
              {stops.map((stop, i) => (
                <li key={stop.id} className="relative flex items-center gap-3">
                  <span className={`cm-timeline-dot ${i === currentIdx ? 'cm-timeline-dot--current' : ''}`} />
                  <button
                    type="button"
                    onClick={() => onStopClick(stop.id)}
                    className={`text-left text-[0.9375rem] ${
                      i === stops.length - 1 ? 'font-extrabold text-[#3CB44A]' : 'font-medium'
                    } ${i === currentIdx ? 'font-bold' : ''}`}
                  >
                    {stop.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-[#6B7280]">
            <Footprints className="h-4 w-4" />
            <span className="font-semibold">Leave station</span>
            <span className="ml-auto font-bold">1 min</span>
          </div>

          <div className="cm-best-exit mt-3">
            <p className="text-xs font-bold text-[#6B7280]">Best Exit</p>
            <p className="font-extrabold text-[#3CB44A]">{dest} Station, main gate</p>
          </div>
        </div>
      </div>
    </div>
  )
}
