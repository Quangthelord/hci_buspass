import { Bus, MapPin, Route } from 'lucide-react'
import type { BusRouteData } from '../../data/busRoutes'
import {
  ANNOUNCEMENTS,
  BUS_STOP_CODE,
  BUS_STOP_DISTANCE,
  BUS_STOP_STREET,
  MT,
  type TransportMode,
} from './constants'
import {
  MtAnnouncementsBar,
  MtAppHeader,
  MtBusStopCard,
  MtDisclaimer,
  MtMapCanvas,
  MtModeToggle,
  MtNearYouDrawer,
  MtSearchBar,
  MtServiceRow,
  MtYellowHeader,
  getDestination,
} from './MtShared'

/* ── Home (Bus tab) ── */
export function MtHomeScreen({
  stopName,
  routes,
  query,
  mode,
  stopExpanded,
  onQueryChange,
  onModeChange,
  onToggleStop,
  onSelectRoute,
  onViewMap,
  onNearYou,
  onAnnouncements,
  onJourney,
  onSearchFocus,
}: {
  stopName: string
  routes: BusRouteData[]
  query: string
  mode: TransportMode
  stopExpanded: boolean
  onQueryChange: (q: string) => void
  onModeChange: (m: TransportMode) => void
  onToggleStop: () => void
  onSelectRoute: (r: BusRouteData) => void
  onViewMap: (r: BusRouteData) => void
  onNearYou: () => void
  onAnnouncements: () => void
  onJourney: () => void
  onSearchFocus: () => void
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <MtAppHeader />
      <MtAnnouncementsBar count={ANNOUNCEMENTS.length} onClick={onAnnouncements} />

      <div className="py-3" onPointerDown={onSearchFocus}>
        <MtSearchBar value={query} onChange={onQueryChange} />
      </div>

      <MtModeToggle
        mode={mode}
        onChange={(m) => {
          if (m === 'mrt') onModeChange('mrt')
          else onModeChange('bus')
        }}
      />

      {mode === 'bus' ? (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <p className="flex items-center gap-2 px-4 py-3 text-sm text-[#757575]">
            <span className="text-[#FFC107]">★</span>
            Favorite your preferred buses to see their arrival times here.
          </p>

          <div className="grid grid-cols-3 gap-2 px-4 pb-4">
            <button
              type="button"
              onClick={onNearYou}
              className="flex flex-col items-center gap-1 rounded-lg py-3 text-center text-xs font-semibold text-[#1565C0]"
            >
              <MapPin className="h-6 w-6" />
              Bus Stops Near You
            </button>
            <button
              type="button"
              className="flex flex-col items-center gap-1 rounded-lg py-3 text-center text-xs font-semibold text-[#1565C0]"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded bg-[#424242] text-xs font-bold text-white">
                01
              </span>
              Bus Services
            </button>
            <button
              type="button"
              onClick={onJourney}
              className="flex flex-col items-center gap-1 rounded-lg py-3 text-center text-xs font-semibold text-[#1565C0]"
            >
              <Route className="h-6 w-6" />
              Journey Planner
            </button>
          </div>

          <div className="border-t border-[#EEEEEE]">
            <p className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-[#212121]">
              <Bus className="h-4 w-4" />
              Bus Stops
            </p>
            <MtDisclaimer />
            <MtBusStopCard
              stopName={stopName}
              stopCode={BUS_STOP_CODE}
              street={BUS_STOP_STREET}
              distance={BUS_STOP_DISTANCE}
              routes={routes}
              expanded={stopExpanded}
              onToggle={onToggleStop}
              onSelectRoute={onSelectRoute}
              onViewMap={onViewMap}
              filterQuery={query}
            />
          </div>
        </div>
      ) : null}

      <MtNearYouDrawer onClick={onNearYou} />
    </div>
  )
}

/* ── Near You ── */
export function MtNearYouScreen({
  stopName,
  routes,
  query,
  stopExpanded,
  onQueryChange,
  onClose,
  onToggleStop,
  onSelectRoute,
  onViewMap,
  onRefresh,
  onSearchFocus,
}: {
  stopName: string
  routes: BusRouteData[]
  query: string
  stopExpanded: boolean
  onQueryChange: (q: string) => void
  onClose: () => void
  onToggleStop: () => void
  onSelectRoute: (r: BusRouteData) => void
  onViewMap: (r: BusRouteData) => void
  onRefresh: () => void
  onSearchFocus: () => void
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <MtYellowHeader title="Near You" onClose={onClose} />
      <div className="mt-sg-yellow-header px-4 pb-3" onPointerDown={onSearchFocus}>
        <MtSearchBar
          value={query}
          onChange={onQueryChange}
          placeholder="Address for bus stops"
        />
      </div>

      <div className="relative h-[42vh] shrink-0">
        <MtMapCanvas />
      </div>

      <div className="mt-sg-panel flex min-h-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-[#EEEEEE] px-4 py-3">
          <p className="flex items-center gap-2 text-sm font-bold">
            <Bus className="h-4 w-4" />
            Bus Stops
          </p>
          <button type="button" onClick={onRefresh} aria-label="Refresh">
            <span className="text-[#757575]">↻</span>
          </button>
        </div>
        <MtDisclaimer />
        <div className="min-h-0 flex-1 overflow-y-auto">
          <MtBusStopCard
            stopName={stopName}
            stopCode={BUS_STOP_CODE}
            street={BUS_STOP_STREET}
            distance={BUS_STOP_DISTANCE}
            routes={routes}
            expanded={stopExpanded}
            onToggle={onToggleStop}
            onSelectRoute={onSelectRoute}
            onViewMap={onViewMap}
            filterQuery={query}
          />
        </div>
      </div>
    </div>
  )
}

/* ── Live map ── */
export function MtLiveMapScreen({
  route,
  stopName,
  onBack,
  onViewRoute,
  onSelectRoute,
}: {
  route: BusRouteData
  stopName: string
  onBack: () => void
  onViewRoute: () => void
  onSelectRoute: () => void
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <div className="relative h-[50vh] shrink-0">
        <MtMapCanvas highlightRouteId={route.id} />
      </div>

      <div className="mt-sg-panel flex min-h-0 flex-1 flex-col">
        <div className="flex items-start justify-between border-b border-[#EEEEEE] px-4 py-3">
          <div>
            <p className="font-bold text-[#212121]">{stopName}</p>
            <p className="text-sm text-[#757575]">
              {BUS_STOP_CODE} | {BUS_STOP_STREET}
            </p>
          </div>
          <button type="button" className="text-[#757575]" aria-label="Refresh">
            ↻
          </button>
        </div>
        <MtDisclaimer />
        <div className="min-h-0 flex-1 overflow-y-auto">
          <MtServiceRow
            route={route}
            starred
            onSelect={onSelectRoute}
            showViewMap={false}
          />
        </div>
        <button
          type="button"
          onClick={onViewRoute}
          className="flex w-full items-center justify-center gap-2 border-t border-[#EEEEEE] py-4 text-sm font-bold text-[#1565C0]"
        >
          <Route className="h-4 w-4" />
          View Bus Route
        </button>
        <button
          type="button"
          onClick={onBack}
          className="border-t border-[#EEEEEE] py-3 text-center text-sm text-[#757575]"
        >
          ← Back
        </button>
      </div>
    </div>
  )
}

/* ── Bus route ── */
export function MtBusRouteScreen({
  route,
  onBack,
  onStopClick,
}: {
  route: BusRouteData
  onBack: () => void
  onStopClick: (id: string) => void
}) {
  const dest = getDestination(route)

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="relative h-[45vh] shrink-0">
        <MtMapCanvas highlightRouteId={route.id} />
        <div className="absolute left-4 top-4 rounded-lg bg-white/95 px-3 py-2 shadow-md">
          <span className="mt-sg-service-badge">{route.id}</span>
          <p className="mt-1 text-sm font-bold">Towards {dest}</p>
        </div>
      </div>
      <div className="mt-sg-panel flex min-h-0 flex-1 flex-col">
        <p className="border-b border-[#EEEEEE] px-4 py-3 text-sm font-bold">Route stops</p>
        <ul className="min-h-0 flex-1 overflow-y-auto">
          {route.stops.map((stop, i) => (
            <li key={stop.id} className="border-b border-[#F5F5F5]">
              <button
                type="button"
                onClick={() => onStopClick(stop.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left"
              >
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{
                    background:
                      i === 0 ? MT.mapBlue : i === route.stops.length - 1 ? '#D32F2F' : '#9E9E9E',
                  }}
                >
                  {i === 0 ? 'A' : i === route.stops.length - 1 ? 'B' : i + 1}
                </span>
                <div>
                  <p className="font-semibold">{stop.name}</p>
                  <p className="text-sm text-[#757575]">~{stop.nextArrival + route.currentDelay} min</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={onBack}
          className="border-t border-[#EEEEEE] py-3 text-center text-sm font-semibold text-[#1565C0]"
        >
          ← Back to arrivals
        </button>
      </div>
    </div>
  )
}

/* ── MRT tab ── */
export function MtMrtScreen({ onBack }: { onBack: () => void }) {
  const stations = [
    { code: 'B1', name: 'Bến Thành', line: 'B1', color: '#4CAF50', crowd: 'low' },
    { code: 'B2', name: 'Suối Tiên', line: 'B1', color: '#4CAF50', crowd: 'moderate' },
    { code: 'B3', name: 'Ga Sài Gòn', line: 'B2', color: '#1565C0', crowd: 'high' },
  ]

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <MtYellowHeader title="MRT/LRT" onClose={onBack} onRefresh={() => {}} />
      <div className="mt-sg-yellow-header px-4 pb-3">
        <MtSearchBar value="" onChange={() => {}} placeholder="Station name" />
      </div>
      <div className="flex items-center justify-around border-b border-[#EEEEEE] bg-white px-4 py-2 text-xs text-[#757575]">
        <span>🔴 High</span>
        <span>🟠 Moderate</span>
        <span>🟢 Low</span>
        <span>⚪ No Data</span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <p className="mb-3 text-sm font-bold">Platform Crowd Density</p>
        {stations.map((s) => (
          <div key={s.code} className="mb-3 flex items-center gap-3 rounded-lg border border-[#EEEEEE] p-3">
            <span className="mt-sg-mrt-badge" style={{ background: s.color }}>
              {s.line}
            </span>
            <div className="flex-1">
              <p className="font-semibold">{s.name}</p>
              <div className="mt-sg-mrt-line mt-1 w-full" style={{ background: s.color }} />
            </div>
            <span className="text-lg">
              {s.crowd === 'high' ? '🔴' : s.crowd === 'moderate' ? '🟠' : '🟢'}
            </span>
          </div>
        ))}
        <button
          type="button"
          onClick={onBack}
          className="mt-4 w-full rounded-lg bg-[#FFD54F] py-3 text-sm font-bold"
        >
          Switch to BUS tab
        </button>
      </div>
    </div>
  )
}

/* ── Announcements ── */
export function MtAnnouncementsScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <MtYellowHeader title="Announcements" onClose={onBack} rightIcon="home" />
      <div className="min-h-0 flex-1 overflow-y-auto">
        {ANNOUNCEMENTS.map((a) => (
          <div key={a.id} className="mt-sg-announce-item flex gap-3">
            {a.hasImage && (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded bg-[#EEEEEE] text-2xl">
                🚌
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="mt-sg-announce-tag">{a.tag}</p>
              <p className="mt-0.5 font-bold leading-snug text-[#212121]">{a.title}</p>
              <p className="mt-1 text-xs text-[#9E9E9E]">{a.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Journey planner (stub) ── */
export function MtJourneyScreen({
  query,
  onQueryChange,
  onBack,
  onSearchFocus,
}: {
  query: string
  onQueryChange: (q: string) => void
  onBack: () => void
  onSearchFocus: () => void
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <MtYellowHeader title="Journey Options" onClose={onBack} rightIcon="home" />
      <div className="mt-sg-yellow-header space-y-2 px-4 pb-4" onPointerDown={onSearchFocus}>
        <input
          className="w-full rounded-lg border-none px-4 py-3 text-sm shadow-md outline-none"
          placeholder="Current Location"
          readOnly
          value="Bến Thành Bus Terminal"
        />
        <input
          className="w-full rounded-lg border-none px-4 py-3 text-sm shadow-md outline-none"
          placeholder="Destination"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>
      <div className="flex-1 p-4">
        <p className="mb-3 text-sm font-semibold text-[#757575]">Suggested routes:</p>
        <button
          type="button"
          onClick={onBack}
          className="flex w-full items-center justify-between rounded-lg border border-[#EEEEEE] p-4 text-left"
        >
          <span className="flex items-center gap-2 font-bold">
            <span className="mt-sg-service-badge text-sm">01</span>
            Bus → Suối Tiên
          </span>
          <span className="font-bold">~35 mins</span>
        </button>
      </div>
    </div>
  )
}
