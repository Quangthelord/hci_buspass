import { Bus, Clock, Footprints, HelpCircle, MapPin, Pencil, Trash2 } from 'lucide-react'
import type { BusRouteData } from '../../data/busRoutes'
import { FAVOURITE_PLACES } from './constants'
import { getEtaContext } from './etaContext'
import type { JourneyOption } from './journeyOptions'
import { getDestination } from './journeyOptions'
import {
  TpBottomNav,
  TpCardChevron,
  TpFieldActions,
  TpHeader,
  TpJourneyFlow,
  TpJourneySummary,
  TpLiveHeader,
  TpOptionsBar,
  TpSwapButton,
} from './TpComponents'
import { TpMap } from './TpMap'
import { TpInterruptionLink } from './DelayReason'
import {
  formatClock12,
  formatDepartLabel,
  formatTimeRange,
  totalWalkM,
} from './utils'

/* ── Places / Favourites ── */
export function TpPlacesScreen({
  onAddPlace,
  onPlaceTap,
  onTab,
}: {
  onAddPlace: () => void
  onPlaceTap: (name: string, address: string) => void
  onTab: (tab: 'places' | 'journeys' | 'routes') => void
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#F5F5F5]">
      <TpHeader title="Favourites" />
      <div className="flex-1 overflow-y-auto p-4">
        <button type="button" className="tp-btn-yellow mb-4" onClick={onAddPlace}>
          Add new place
        </button>
        {FAVOURITE_PLACES.map((place) => (
          <button
            key={place.id}
            type="button"
            className="tp-card-row mb-0 shadow-sm"
            onClick={() => onPlaceTap(place.name, place.address)}
          >
            <div className="tp-card-body">
              <span className="tp-card-icon">
                <MapPin className="h-5 w-5" strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-extrabold text-[#1A1A1A]">{place.name}</p>
                <p className="text-sm text-[#888]">{place.address}</p>
              </div>
              <button
                type="button"
                className="p-2 text-[#666]"
                onClick={(e) => e.stopPropagation()}
                aria-label="Edit"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="p-2 text-[#666]"
                onClick={(e) => e.stopPropagation()}
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <TpCardChevron />
          </button>
        ))}
      </div>
      <TpBottomNav
        active="places"
        onPlaces={() => onTab('places')}
        onJourneys={() => onTab('journeys')}
        onRoutes={() => onTab('routes')}
      />
    </div>
  )
}

/* ── Stops Near Me ── */
export function TpStopsNearMeScreen({
  stationName,
  onStopTap,
  onTab,
}: {
  stationName: string
  onStopTap: () => void
  onTab: (tab: 'places' | 'journeys' | 'routes') => void
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <TpHeader title="Stops Near Me" />
      <div className="tp-map-wrap tp-map-wrap--near relative flex-1">
        <TpMap variant="near" />
        <div className="tp-search-bar">
          <span className="min-w-0 flex-1 truncate">{stationName}, TP.HCM</span>
          <CrosshairIcon />
        </div>
        <button type="button" className="tp-stop-callout" onClick={onStopTap}>
          <div className="tp-card-body">
            <span className="tp-card-icon">
              <Bus className="h-5 w-5" strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-extrabold">{stationName}</p>
              <p className="text-sm text-[#888]">
                01, 02, 08 · <Footprints className="inline h-3 w-3" /> 64m
              </p>
            </div>
          </div>
          <TpCardChevron />
        </button>
      </div>
      <TpBottomNav
        active="routes"
        onPlaces={() => onTab('places')}
        onJourneys={() => onTab('journeys')}
        onRoutes={() => onTab('routes')}
      />
    </div>
  )
}

function CrosshairIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
    </svg>
  )
}

/* ── Journey Planner ── */
export function TpPlannerScreen({
  origin,
  destination,
  options,
  onBack,
  onSwap,
  onOriginChange,
  onDestinationChange,
  onSelectOption,
  onSearchFocus,
  onTab,
}: {
  origin: string
  destination: string
  options: JourneyOption[]
  onBack: () => void
  onSwap: () => void
  onOriginChange: (v: string) => void
  onDestinationChange: (v: string) => void
  onSelectOption: (opt: JourneyOption) => void
  onSearchFocus: () => void
  onTab: (tab: 'places' | 'journeys' | 'routes') => void
}) {
  const hasDest = destination.trim().length > 0

  return (
    <div className="flex min-h-dvh flex-col bg-[#F5F5F5]">
      <TpHeader title="Where do you want to go?" showBack onBack={onBack} />

      <div className="tp-planner-fields">
        <div className="flex gap-1">
          <div className="flex-1">
            <div className="tp-field">
              <input
                value={origin}
                onChange={(e) => onOriginChange(e.target.value)}
                className="tp-field-input"
                placeholder="From"
              />
              <TpFieldActions />
            </div>
            <div className="tp-field" onPointerDown={onSearchFocus}>
              <input
                value={destination}
                onChange={(e) => onDestinationChange(e.target.value)}
                className="tp-field-input"
                placeholder="To"
                autoFocus={!hasDest}
              />
              <TpFieldActions />
            </div>
          </div>
          <TpSwapButton onClick={onSwap} />
        </div>

        <div className="tp-depart-row">
          <div className="tp-depart-field">{formatDepartLabel()}</div>
          <button type="button" className="tp-btn-now">
            Now
          </button>
        </div>
      </div>

      <TpOptionsBar />

      <div className="min-h-0 flex-1 overflow-y-auto">
        {hasDest ? (
          options.map((opt) => {
            const total = opt.travelTimeMin + Math.ceil(opt.walkBeforeM / 80) + Math.ceil(opt.walkAfterM / 80)
            const walkTotal = totalWalkM(opt.walkBeforeM, opt.walkAfterM)
            const ctx = getEtaContext(opt.route)
            const hasInterrupt = ctx.status !== 'on_time'

            return (
              <button
                key={opt.id}
                type="button"
                className="tp-journey-card"
                onClick={() => onSelectOption(opt)}
              >
                <div className="tp-journey-body">
                  <TpJourneyFlow
                    walkBefore={opt.walkBeforeM}
                    routeId={opt.route.id}
                    walkAfter={opt.walkAfterM}
                  />
                  <div className="tp-journey-meta">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {formatTimeRange(opt.nextDeparture, total)}
                    </span>
                    <span>{opt.zones} zones</span>
                    <span>{opt.fare}</span>
                    <span className="flex items-center gap-1">
                      <Footprints className="h-3.5 w-3.5" />
                      {walkTotal}m
                    </span>
                  </div>
                  {hasInterrupt && (
                    <p className="tp-journey-interrupt">
                      Interruptions |{' '}
                      <TpInterruptionLink route={opt.route} />
                    </p>
                  )}
                </div>
                <TpCardChevron />
              </button>
            )
          })
        ) : (
          <p className="p-6 text-center text-sm text-[#888]">
            Enter a destination to see journey options
          </p>
        )}
      </div>

      <TpBottomNav
        active="journeys"
        onPlaces={() => onTab('places')}
        onJourneys={() => onTab('journeys')}
        onRoutes={() => onTab('routes')}
      />
    </div>
  )
}

/* ── Your Journey ── */
export function TpJourneyScreen({
  option,
  destination,
  stationName,
  onBack,
  onLiveBus,
  onStopClick,
}: {
  option: JourneyOption
  destination: string
  stationName: string
  onBack: () => void
  onLiveBus: () => void
  onStopClick: (id: string) => void
}) {
  const route = option.route
  const dest = getDestination(route, destination)
  const walkMin = Math.max(1, Math.ceil(option.walkBeforeM / 80))
  const rideMin = option.travelTimeMin
  const walkEndMin = Math.max(1, Math.ceil(option.walkAfterM / 80))
  const totalMin = walkMin + rideMin + walkEndMin
  const destStop =
    route.stops.find((s) => s.name.toLowerCase().includes(destination.toLowerCase())) ??
    route.stops[route.stops.length - 1]
  const visibleStops = route.stops.slice(0, route.stops.indexOf(destStop) + 1)

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <TpHeader title="Your Journey" showBack onBack={onBack} />

      <div className="tp-map-wrap tp-map-wrap--journey shrink-0">
        <TpMap variant="journey" routeId={route.id} />
      </div>

      <TpJourneySummary
        walkBefore={option.walkBeforeM}
        routeId={route.id}
        walkAfter={option.walkAfterM}
      />

      <div className="tp-step-list">
        <div className="tp-step">
          <div className="tp-step-icon-col">
            <MapPin className="h-5 w-5 text-[#00703C]" fill="#00703C" strokeWidth={0} />
          </div>
          <div className="flex-1">
            <p className="tp-step-title">Start</p>
            <p className="tp-step-sub">
              Leave {stationName}
              <br />
              {formatClock12(option.nextDeparture)}
            </p>
          </div>
        </div>

        <div className="tp-step">
          <div className="tp-step-rail">
            <span className="tp-step-num">1</span>
            <span className="tp-step-line" />
          </div>
          <div className="tp-step-icon-col">
            <Footprints className="h-5 w-5 text-[#555]" />
          </div>
          <div className="flex-1">
            <p className="tp-step-title">Walk to {stationName}</p>
            <p className="tp-step-sub">
              About {walkMin} mins ({option.walkBeforeM} metres)
            </p>
          </div>
        </div>

        <div className="tp-step">
          <div className="tp-step-rail">
            <span className="tp-step-num">2</span>
            <span className="tp-step-line" />
          </div>
          <div className="tp-step-icon-col">
            <Bus className="h-5 w-5 text-[#555]" />
          </div>
          <div className="flex-1">
            <p className="tp-step-title">
              Catch Bus {route.id}, {stationName}
            </p>
            <p className="tp-step-sub">
              Stop {route.stops[0].id} to {destStop.name} Stop {destStop.id}
              <br />
              {formatTimeRange(option.nextDeparture + walkMin, rideMin)} ({rideMin} mins)
              <br />
              (estimated time only)
            </p>
            <button type="button" className="tp-live-tag" onClick={onLiveBus}>
              LIVE BUS DATA AVAILABLE
            </button>
          </div>
        </div>

        <div className="tp-step">
          <div className="tp-step-rail">
            <span className="tp-step-num">3</span>
          </div>
          <div className="tp-step-icon-col">
            <Footprints className="h-5 w-5 text-[#555]" />
          </div>
          <div className="flex-1">
            <p className="tp-step-title">Walk to {dest}</p>
            <p className="tp-step-sub">
              About {walkEndMin} mins ({option.walkAfterM} metres)
            </p>
          </div>
        </div>

        <div className="tp-step">
          <div className="tp-step-icon-col">
            <MapPin className="h-5 w-5 text-[#D32F2F]" fill="#D32F2F" strokeWidth={0} />
          </div>
          <div className="flex-1">
            <p className="tp-step-title">Arrive at {dest}</p>
            <p className="tp-step-sub">{formatClock12(option.nextDeparture + totalMin)}</p>
            <ul className="mt-2 space-y-1">
              {visibleStops.map((stop) => (
                <li key={stop.id}>
                  <button
                    type="button"
                    onClick={() => onStopClick(stop.id)}
                    className="text-sm text-[#666] hover:text-[#00703C]"
                  >
                    · {stop.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Live Bus ── */
export function TpLiveBusScreen({
  route,
  onBack,
}: {
  route: BusRouteData
  onBack: () => void
}) {
  const wait = route.stops[0].nextArrival + route.currentDelay
  const nextStop = route.stops[1] ?? route.stops[0]

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <TpLiveHeader routeId={route.id} onBack={onBack} />

      <div className="tp-live-bar shrink-0">
        <span className="tp-live-badge">LIVE</span>
        <span className="text-sm text-[#444]">
          Next stop: {nextStop.id} | {formatClock12(wait)}
        </span>
        <button type="button" className="ml-auto text-[#1565C0]" aria-label="Help">
          <HelpCircle className="h-5 w-5" />
        </button>
      </div>

      <div className="tp-map-wrap tp-map-wrap--live flex-1">
        <TpMap variant="live" routeId={route.id} busProgress={0.45} />
      </div>

      <div className="tp-stop-card">
        <div className="tp-stop-card-body">
          <MapPin className="h-8 w-8 shrink-0 text-[#00703C]" fill="#00703C" strokeWidth={0} />
          <div>
            <p className="text-xs font-bold text-[#666]">Selected stop: {route.stops[0].id}</p>
            <p className="text-lg font-extrabold">{route.stops[0].name}</p>
            <p className="text-sm text-[#888]">Bến Thành Terminal</p>
          </div>
        </div>
        <div className="tp-stop-arrival">
          <p className="tp-arrival-mins">{Math.max(1, wait)} MINS</p>
          <p className="tp-arrival-time">
            <span className="tp-arrival-dot" />
            {formatClock12(wait)}
          </p>
        </div>
        <TpCardChevron />
      </div>
    </div>
  )
}
