import { useEffect, useMemo, useRef, useState } from 'react'
import { Search } from 'lucide-react'
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
import { useMobileScroll } from '../hooks/useMobileScroll'
import { useDayNightTheme } from '../lib/useDayNightTheme'
import { useAdaptiveMode } from '../lib/useAdaptiveMode'
import { useUrgencyPulse } from '../lib/useUrgencyPulse'
import { D6LeafletMap } from '../components/d6/D6LeafletMap'
import { ArrivalCard } from '../components/d6/ArrivalCard'
import { SeniorModePrompt } from '../components/d6/SeniorModePrompt'
import { UrgencyArrivalBanner } from '../components/d6/UrgencyArrivalBanner'
import { filterLocations } from '../variants/Variant_4_MetroMinimal/locations'

export const VARIANT_ID = 'Variant_6_BusPassSignature' as const

export interface BusPassSignatureProps {
  stationId?: string
  userId?: string
  initialRouteId?: string
  initialDestination?: string
  onSyncRequest?: (route: BusRouteData) => void
  onDestinationPick?: (destination: string, route?: BusRouteData) => void
}

function getArrivalMinutes(route: BusRouteData): number {
  return route.stops[0].nextArrival + route.currentDelay
}

export default function BusPassSignaturePage({
  stationId = 'ben-thanh',
  userId = 'participant-01',
  initialRouteId,
  initialDestination,
  onSyncRequest,
  onDestinationPick,
}: BusPassSignatureProps) {
  useMobileScroll()
  useDayNightTheme()

  const [now, setNow] = useState(new Date())
  const [query, setQuery] = useState(initialDestination ?? '')
  const [selectedRouteId, setSelectedRouteId] = useState(initialRouteId ?? TASK_ROUTE_ID)
  const [showMoreArrivals, setShowMoreArrivals] = useState(false)
  const taskStarted = useRef(false)
  const taskDone = useRef(false)

  const liveRoutes = useLiveBusRoutes()
  const adaptive = useAdaptiveMode(VARIANT_ID)
  const { recordMisclick } = adaptive
  const { level: urgencyLevel, isArriving } = useUrgencyPulse(true, selectedRouteId)

  const stationName =
    busRoutesData.station.id === stationId
      ? busRoutesData.station.name
      : busRoutesData.station.name

  const arrivals = useMemo(
    () =>
      [...liveRoutes.filter((r) => r.stops[0]?.name === busRoutesData.station.name)]
        .sort((a, b) => getArrivalMinutes(a) - getArrivalMinutes(b)),
    [liveRoutes],
  )

  const primaryRoute =
    liveRoutes.find((r) => r.id === selectedRouteId) ??
    arrivals[0] ??
    liveRoutes[0]

  const moreArrivals = arrivals.filter((r) => r.id !== primaryRoute?.id)

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

  if (!primaryRoute) {
    return (
      <div className="d6-root flex min-h-dvh items-center justify-center font-sans">
        <p className="font-bold">Đang tải dữ liệu tuyến…</p>
      </div>
    )
  }

  const timeStr = formatTime24(now)

  return (
    <div className="d6-root d6-map-page d6-map-page--light flex min-h-dvh flex-col font-sans">
      <UrgencyArrivalBanner visible={isArriving} />

      <header className="d6-header d6-header--compact flex shrink-0 items-center justify-between gap-3 border-b px-3 py-2">
        <div>
          <p className="d6-header-label font-bold uppercase tracking-wide">Trạm</p>
          <h1 className="d6-station-name font-bold">{stationName}</h1>
        </div>
        <time className="d6-clock font-bold tabular-nums" dateTime={now.toISOString()}>
          {timeStr}
        </time>
      </header>

      <div className="d6-search-strip relative z-20 shrink-0 border-b px-3 py-2">
        <label className="d6-search-label relative block">
          <Search
            className="d6-search-icon pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
            strokeWidth={2}
          />
          <input
            type="search"
            value={query}
            placeholder="Bạn muốn đến đâu?"
            onChange={(e) => {
              ensureTaskStart()
              adaptive.recordTouch('search-input')
              setQuery(e.target.value)
              trackClick('search-input', true)
            }}
            onFocus={() => adaptive.recordTouch('search-focus')}
            className="d6-search-input w-full rounded-lg border-2 py-2.5 pl-10 pr-3 font-semibold outline-none"
            autoComplete="off"
          />
        </label>
        {query.trim() && suggestions.length > 0 && (
          <ul className="d6-suggestions-dropdown absolute left-3 right-3 top-full z-30 mt-1 max-h-40 overflow-y-auto rounded-lg border-2 shadow-lg">
            {suggestions.map((loc) => (
              <li key={loc}>
                <button
                  type="button"
                  className="d6-suggestion-btn w-full px-4 py-3 text-left font-semibold"
                  onClick={() => {
                    handleInteraction(`destination-${loc}`, () => setQuery(loc))
                    const taskRoute = loc === TASK_DESTINATION ? findTaskRoute(liveRoutes) : undefined
                    if (taskRoute) {
                      setSelectedRouteId(taskRoute.id)
                      tryCompleteTask(taskRoute)
                    }
                    onDestinationPick?.(loc, taskRoute)
                  }}
                >
                  {loc}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="d6-map-layout flex min-h-0 flex-1 flex-col lg:flex-row">
        <section className="d6-map-stage relative min-h-[52vh] flex-[7] lg:min-h-0">
          <D6LeafletMap
            route={primaryRoute}
            destinationKeyword={query}
            urgencyLevel={urgencyLevel}
            busProgress={0.18 + urgencyLevel * 0.08}
          />
        </section>

        <aside className="d6-aside d6-aside--panel flex w-full shrink-0 flex-col border-t lg:max-w-[300px] lg:flex-[3] lg:border-l lg:border-t-0">
          <h2 className="d6-aside-title shrink-0 px-3 pb-1.5 pt-2 font-bold uppercase tracking-wide">
            Xe sắp đến
          </h2>

          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 pb-2">
            <ArrivalCard
              route={primaryRoute}
              destination={getRouteDestination(primaryRoute)}
              minutes={getArrivalMinutes(primaryRoute)}
              onTime={primaryRoute.currentDelay === 0}
              active
              onSelect={() =>
                handleInteraction(
                  `arrival-primary-${primaryRoute.id}`,
                  () => setSelectedRouteId(primaryRoute.id),
                  { route: primaryRoute },
                )
              }
            />

            {showMoreArrivals &&
              moreArrivals.map((route) => (
                <ArrivalCard
                  key={route.id}
                  route={route}
                  destination={getRouteDestination(route)}
                  minutes={getArrivalMinutes(route)}
                  onTime={route.currentDelay === 0}
                  onSelect={() =>
                    handleInteraction(
                      `arrival-${route.id}`,
                      () => setSelectedRouteId(route.id),
                      { route },
                    )
                  }
                />
              ))}
          </div>

          <div className="d6-aside-actions shrink-0 space-y-1.5 px-3 pb-3">
            {moreArrivals.length > 0 && (
              <button
                type="button"
                className="d6-link-btn min-h-11 w-full rounded-lg border-2 px-3 py-2.5 font-bold"
                onClick={() =>
                  handleInteraction('more-arrivals', () => setShowMoreArrivals((v) => !v))
                }
              >
                {showMoreArrivals ? 'Ẩn bớt' : 'Xem thêm chuyến'}
              </button>
            )}

            {onSyncRequest && primaryRoute && (
              <button
                type="button"
                className="d6-btn-sync w-full rounded-lg py-3 text-base font-bold"
                onClick={() =>
                  handleInteraction('sync-phone', () => onSyncRequest(primaryRoute), {
                    route: primaryRoute,
                  })
                }
              >
                ĐỒNG BỘ VÀO ĐIỆN THOẠI 📱
              </button>
            )}
          </div>
        </aside>
      </div>

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
