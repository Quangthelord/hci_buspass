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
import { NeonRouteMap } from '../components/d6/NeonRouteMap'
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
    <div className="d6-root flex min-h-dvh flex-col font-sans">
      <UrgencyArrivalBanner visible={isArriving} />

      {/* Header */}
      <header className="d6-header flex shrink-0 items-start justify-between gap-4 border-b px-5 py-4">
        <div>
          <p className="d6-header-label font-bold uppercase tracking-wide">Trạm</p>
          <h1 className="d6-station-name font-bold">{stationName}</h1>
        </div>
        <time className="d6-clock font-bold tabular-nums" dateTime={now.toISOString()}>
          {timeStr}
        </time>
      </header>

      {/* Search */}
      <div className="shrink-0 border-b px-5 py-4">
        <label className="d6-search-label relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" strokeWidth={2} />
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
            className="d6-search-input w-full rounded-xl border-2 py-3 pl-12 pr-4 font-semibold outline-none"
            autoComplete="off"
          />
        </label>
        {query.trim() && (
          <ul className="mt-2 space-y-1">
            {suggestions.map((loc) => (
              <li key={loc}>
                <button
                  type="button"
                  className="d6-suggestion-btn w-full rounded-lg px-4 py-3 text-left font-semibold"
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

      {/* Map + arrivals split */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <section className="d6-map-panel min-h-[42vh] flex-1 p-4 lg:min-h-0">
          <NeonRouteMap
            route={primaryRoute}
            urgencyLevel={urgencyLevel}
            simplified={adaptive.seniorMode}
          />
        </section>

        <aside className="d6-aside flex w-full shrink-0 flex-col border-t lg:w-80 lg:border-l lg:border-t-0">
          <h2 className="d6-aside-title shrink-0 px-4 pb-2 pt-4 font-bold uppercase tracking-wide">
            Xe sắp đến
          </h2>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-4">
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

          {moreArrivals.length > 0 && (
            <button
              type="button"
              className="d6-link-btn mx-4 mb-4 min-h-14 shrink-0 rounded-xl border-2 px-4 py-3 font-bold"
              onClick={() =>
                handleInteraction('more-arrivals', () =>
                  setShowMoreArrivals((v) => !v),
                )
              }
            >
              {showMoreArrivals ? 'Ẩn bớt' : 'Xem thêm chuyến'}
            </button>
          )}

          {onSyncRequest && primaryRoute && (
            <button
              type="button"
              className="btn-kiosk mx-4 mb-4 shrink-0 rounded-xl bg-neon-green py-4 text-lg font-bold text-white"
              onClick={() =>
                handleInteraction('sync-phone', () => onSyncRequest(primaryRoute), {
                  route: primaryRoute,
                })
              }
            >
              ĐỒNG BỘ VÀO ĐIỆN THOẠI 📱
            </button>
          )}
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
