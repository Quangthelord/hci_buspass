import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { busRoutesData, useLiveBusRoutes, type BusRouteData } from '../data/busRoutes'
import { formatTime24 } from '../lib/formatVi'
import { completeTask, logClick, startTask } from '../lib/telemetry'
import {
  findTaskRoute,
  getRouteDestination,
  matchesTaskDestination,
  TASK_DESTINATION,
  TASK_ROUTE_ID,
} from '../lib/taskGoal'
import { useDayNightTheme } from '../lib/useDayNightTheme'
import { useAdaptiveMode } from '../lib/useAdaptiveMode'
import { useUrgencyPulse } from '../lib/useUrgencyPulse'
import { D6LeafletMap } from '../components/d6/D6LeafletMap'
import { ArrivalCard } from '../components/d6/ArrivalCard'
import { KioskArrivalHero } from '../components/d6/KioskArrivalHero'
import { MapQrSyncCard } from '../components/d6/MapQrSyncCard'
import { MapTouchA11yBar } from '../components/d6/MapTouchA11yBar'
import { SeniorModePrompt } from '../components/d6/SeniorModePrompt'
import { UrgencyArrivalBanner } from '../components/d6/UrgencyArrivalBanner'
import { filterLocations } from '../variants/Variant_4_MetroMinimal/locations'

export const VARIANT_ID = 'Variant_6_BusPassSignature' as const

export interface BusPassSignatureProps {
  stationId?: string
  userId?: string
  initialRouteId?: string
  initialDestination?: string
  hideHeader?: boolean
  lang?: 'vi' | 'en'
  onRouteRequest?: (route: BusRouteData) => void
  onSyncRequest?: (route: BusRouteData) => void
  onDestinationPick?: (destination: string, route?: BusRouteData) => void
  onHelpRequest?: () => void
  onListRequest?: () => void
}

function getArrivalMinutes(route: BusRouteData): number {
  return route.stops[0].nextArrival + route.currentDelay
}

export default function BusPassSignaturePage({
  stationId = 'ben-thanh',
  userId = 'participant-01',
  initialRouteId,
  initialDestination,
  hideHeader = false,
  lang = 'vi',
  onRouteRequest,
  onSyncRequest,
  onDestinationPick,
  onHelpRequest,
  onListRequest,
}: BusPassSignatureProps) {
  useDayNightTheme()

  const [now, setNow] = useState(new Date())
  const [query, setQuery] = useState(initialDestination ?? '')
  const [searchFocused, setSearchFocused] = useState(false)
  const [selectedRouteId, setSelectedRouteId] = useState(initialRouteId ?? TASK_ROUTE_ID)
  const [showMoreArrivals, setShowMoreArrivals] = useState(false)
  const taskStarted = useRef(false)
  const taskDone = useRef(false)

  const liveRoutes = useLiveBusRoutes()
  const adaptive = useAdaptiveMode(VARIANT_ID)
  const { recordMisclick } = adaptive
  const { level: urgencyLevel, isArriving } = useUrgencyPulse(true, selectedRouteId)

  const stationName = busRoutesData.station.name
  const isSearchMode = query.trim().length > 0

  const arrivals = useMemo(
    () =>
      [...liveRoutes.filter((r) => r.stops[0]?.name === busRoutesData.station.name)].sort(
        (a, b) => getArrivalMinutes(a) - getArrivalMinutes(b),
      ),
    [liveRoutes],
  )

  const primaryRoute =
    liveRoutes.find((r) => r.id === selectedRouteId) ?? arrivals[0] ?? liveRoutes[0]

  const moreArrivals = arrivals.filter((r) => r.id !== primaryRoute?.id)
  const displayDestination = isSearchMode
    ? query.trim()
    : getRouteDestination(primaryRoute)

  const suggestions = useMemo(() => filterLocations(query).slice(0, 5), [query])

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const onMisclick = (e: Event) => {
      const detail = (e as CustomEvent<{ target: string }>).detail
      recordMisclick(detail?.target ?? 'dead-zone')
    }
    window.addEventListener('kiosk:misclick', onMisclick)
    return () => window.removeEventListener('kiosk:misclick', onMisclick)
  }, [recordMisclick])

  const ensureTaskStart = () => {
    if (!taskStarted.current) {
      taskStarted.current = true
      startTask(VARIANT_ID, userId)
    }
  }

  const trackClick = (target: string, isHit = true) => {
    logClick(VARIANT_ID, target, isHit)
  }

  const tryCompleteTask = (route?: BusRouteData) => {
    if (taskDone.current || !route) return
    if (!matchesTaskDestination(route)) return
    completeTask(VARIANT_ID, true, {
      seniorModeActivated: adaptive.seniorMode,
      urgencyLevelAtComplete: urgencyLevel,
    })
    taskDone.current = true
  }

  const handleInteraction = (
    target: string,
    action?: () => void,
    goal?: { route: BusRouteData },
  ) => {
    ensureTaskStart()
    adaptive.recordTouch(target)
    trackClick(target, true)
    action?.()
    adaptive.recordSuccessfulInteraction()
    if (goal) tryCompleteTask(goal.route)
  }

  const clearSearch = () => {
    handleInteraction('search-clear', () => {
      setQuery('')
      setSelectedRouteId(arrivals[0]?.id ?? TASK_ROUTE_ID)
    })
  }

  if (!primaryRoute) {
    return (
      <div className="d6-root flex min-h-0 flex-1 items-center justify-center font-sans">
        <p className="font-bold">{lang === 'vi' ? 'Đang tải dữ liệu tuyến…' : 'Loading routes…'}</p>
      </div>
    )
  }

  const timeStr = formatTime24(now)
  const primaryMinutes = getArrivalMinutes(primaryRoute)
  const isVi = lang === 'vi'

  const openRoute = (route: BusRouteData) => {
    if (onRouteRequest) {
      handleInteraction(`open-route-${route.id}`, () => onRouteRequest(route), { route })
    } else {
      handleInteraction(`arrival-${route.id}`, () => setSelectedRouteId(route.id), { route })
    }
  }

  return (
    <div className="d6-root d6-map-page d6-map-page--light d6-map-page--kiosk flex min-h-0 flex-1 flex-col font-sans">
      <UrgencyArrivalBanner visible={isArriving} />

      {!hideHeader && (
      <header className="d6-kiosk-header flex shrink-0 items-center justify-between gap-3 border-b border-kiosk-border bg-white px-4 py-2.5">
        <time className="d6-kiosk-clock text-2xl font-black tabular-nums text-gray-900" dateTime={now.toISOString()}>
          {timeStr}
        </time>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
            {isVi ? 'Trạm' : 'Stop'}
          </p>
          <p className="text-lg font-bold leading-tight text-neon-green">{stationName}</p>
        </div>
      </header>
      )}

      {/* Bản đồ ~40% — full width */}
      <section className="d6-map-stage d6-map-stage--kiosk relative w-full shrink-0">
        <D6LeafletMap
          route={primaryRoute}
          destinationKeyword={isSearchMode ? query : undefined}
          urgencyLevel={urgencyLevel}
          busProgress={0.18 + urgencyLevel * 0.08}
        />
      </section>

      {/* Thông tin cốt lõi — ETA lớn */}
      <section className="d6-arrivals-hero shrink-0 border-b border-kiosk-border bg-kiosk-panel">
        {isSearchMode && (
          <div className="d6-search-context mb-2 flex items-center justify-between gap-2 rounded-lg border border-neon-green/30 bg-white px-3 py-2">
            <p className="text-sm font-semibold text-gray-800">
              {isVi ? 'Đang tra cứu' : 'Searching'}:{' '}
              <span className="text-neon-green">{query.trim()}</span>
            </p>
            <button
              type="button"
              onClick={clearSearch}
              className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-neon-green"
            >
              <X className="h-3.5 w-3.5" />
              {isVi ? 'Xóa' : 'Clear'}
            </button>
          </div>
        )}

        <h2 className="d6-section-title mb-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-500">
          {isSearchMode
            ? isVi
              ? 'Lộ trình gợi ý'
              : 'Suggested route'
            : isVi
              ? 'Xe sắp đến tại trạm này'
              : 'Arriving at this stop'}
        </h2>

        <KioskArrivalHero
          route={primaryRoute}
          destination={displayDestination}
          minutes={primaryMinutes}
          delayMinutes={primaryRoute.currentDelay}
          active
          searchMode={isSearchMode}
          lang={lang}
          onSelect={() => openRoute(primaryRoute)}
        />

        {showMoreArrivals && (
          <div className="mt-1.5 space-y-1.5">
            {moreArrivals.map((route) => (
              <ArrivalCard
                key={route.id}
                route={route}
                destination={getRouteDestination(route)}
                minutes={getArrivalMinutes(route)}
                onTime={route.currentDelay === 0}
                lang={lang}
                onSelect={() => openRoute(route)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Vùng chạm — vừa tầm tay */}
      <section className="d6-touch-zone kiosk-scroll-pad mt-auto shrink-0 space-y-2 bg-white">
        <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
          {isVi ? 'Tương tác' : 'Actions'}
        </p>

        <div className="relative">
          <label className="relative block">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neon-green"
              strokeWidth={2}
            />
            <input
              type="search"
              value={query}
              placeholder={isVi ? 'Tìm tuyến / điểm đến khác…' : 'Search route or destination…'}
              onChange={(e) => {
                ensureTaskStart()
                adaptive.recordTouch('search-input')
                setQuery(e.target.value)
                trackClick('search-input', true)
              }}
              onFocus={() => {
                setSearchFocused(true)
                adaptive.recordTouch('search-focus')
              }}
              onBlur={() => setSearchFocused(false)}
              className="d6-touch-search w-full rounded-lg border-2 border-kiosk-border pl-9 pr-3 text-sm font-semibold outline-none focus:border-neon-green"
              autoComplete="off"
            />
          </label>
          {(searchFocused || isSearchMode) && query.trim() && suggestions.length > 0 && (
            <ul className="absolute bottom-full left-0 right-0 z-30 mb-1 max-h-36 overflow-y-auto rounded-xl border-2 border-kiosk-border bg-white shadow-lg">
              {suggestions.map((loc) => (
                <li key={loc}>
                  <button
                    type="button"
                    className="w-full border-b border-gray-100 px-4 py-3 text-left text-sm font-semibold last:border-0 hover:bg-green-50"
                    onClick={() => {
                      handleInteraction(`destination-${loc}`, () => setQuery(loc))
                      const taskRoute = loc === TASK_DESTINATION ? findTaskRoute(liveRoutes) : undefined
                      if (taskRoute) {
                        setSelectedRouteId(taskRoute.id)
                        tryCompleteTask(taskRoute)
                      }
                      onDestinationPick?.(loc, taskRoute)
                      setSearchFocused(false)
                    }}
                  >
                    {loc}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {onSyncRequest && !onRouteRequest && (
          <MapQrSyncCard
            route={primaryRoute}
            destination={displayDestination}
            stationId={stationId}
            lang={lang}
            onTap={() =>
              handleInteraction('qr-sync-card', () => onSyncRequest(primaryRoute), {
                route: primaryRoute,
              })
            }
          />
        )}

        {moreArrivals.length > 0 && (
          <button
            type="button"
            className="d6-touch-more btn-kiosk flex w-full items-center justify-center gap-1.5 rounded-lg border-2 border-kiosk-border bg-kiosk-panel font-semibold text-gray-800"
            onClick={() =>
              handleInteraction('more-arrivals', () => setShowMoreArrivals((v) => !v))
            }
          >
            {showMoreArrivals
              ? isVi
                ? '▲ Ẩn bớt chuyến'
                : '▲ Show fewer'
              : isVi
                ? '▼ Xem thêm chuyến'
                : '▼ More arrivals'}
          </button>
        )}

        <MapTouchA11yBar
          lang={lang}
          onHelp={() => onHelpRequest?.()}
          onList={() => onListRequest?.()}
          onTrack={(t) => trackClick(t, true)}
        />
      </section>

      <SeniorModePrompt
        visible={adaptive.showPrompt}
        onAccept={() => {
          trackClick('senior-mode-accept', true)
          adaptive.acceptSeniorMode()
        }}
        onDismiss={() => {
          trackClick('senior-mode-dismiss', true)
          adaptive.dismissPrompt()
        }}
      />
    </div>
  )
}
