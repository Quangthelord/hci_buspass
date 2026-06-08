import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { busRoutesData, useLiveBusRoutes, type BusRouteData } from '../../data/busRoutes'
import { formatTime24 } from '../../lib/formatVi'
import { completeTask, logClick, startTask } from '../../lib/telemetry'
import { matchesTaskDestination } from '../../lib/taskGoal'
import { useMobileScroll } from '../../hooks/useMobileScroll'
import { RouteTag } from '../../components/shared/RouteTag'
import { DelayReason } from './DelayReason'
import { WarmMap } from './WarmMap'
import { WARM, VARIANT_ID } from './constants'
import { getArrivalMinutes, getEtaContext } from './etaContext'

export interface Variant3Props {
  stationId?: string
  userId?: string
}

function getPrimaryRoute(): BusRouteData {
  return busRoutesData.routes.find((r) => r.id === '01') ?? busRoutesData.routes[0]
}

function getDestination(route: BusRouteData): string {
  return route.stops[route.stops.length - 1]?.name ?? '—'
}

export default function Variant3WarmWayfinding({
  stationId = 'ben-thanh',
  userId = 'participant-01',
}: Variant3Props) {
  useMobileScroll()
  const [now, setNow] = useState(new Date())
  const [mapRoute, setMapRoute] = useState<BusRouteData>(getPrimaryRoute)
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [taskDone, setTaskDone] = useState(false)
  const taskStarted = useRef(false)

  const stationName =
    busRoutesData.station.id === stationId
      ? busRoutesData.station.name
      : busRoutesData.station.name

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const ensureTaskStart = () => {
    if (!taskStarted.current) {
      taskStarted.current = true
      startTask(VARIANT_ID, userId)
    }
  }

  const trackClick = (target: string, isHit = true) => {
    logClick(VARIANT_ID, target, isHit)
  }

  const completeIfGoal = (route: BusRouteData) => {
    if (taskDone || !matchesTaskDestination(route)) return
    completeTask(VARIANT_ID, true)
    setTaskDone(true)
  }

  const liveRoutes = useLiveBusRoutes()

  const arrivals = useMemo(
    () =>
      [...liveRoutes.filter((r) => r.stops[0]?.name === stationName)]
        .sort((a, b) => getArrivalMinutes(a) - getArrivalMinutes(b))
        .slice(0, 3),
    [stationName, liveRoutes],
  )

  const timeStr = formatTime24(now)

  const toggleSchedule = () => {
    ensureTaskStart()
    const next = !scheduleOpen
    trackClick(next ? 'schedule-expand' : 'schedule-collapse', true)
    setScheduleOpen(next)
  }

  const selectMapRoute = (route: BusRouteData) => {
    ensureTaskStart()
    trackClick(`map-route-${route.id}`, true)
    setMapRoute(route)
    completeIfGoal(route)
  }

  const selectArrival = (route: BusRouteData) => {
    ensureTaskStart()
    trackClick(`arrival-${route.id}`, true)
    setMapRoute(route)
    completeIfGoal(route)
  }

  return (
    <div
      className="flex min-h-dvh flex-col font-sans font-normal"
      style={{ backgroundColor: WARM.bg, color: WARM.text, fontSize: '18px' }}
    >
      {/* 1. Station header — warm gradient */}
      <header
        className="shrink-0 px-5 py-5"
        style={{ background: WARM.headerGradient }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-base uppercase tracking-wide" style={{ color: WARM.secondary }}>
              Trạm hiện tại
            </p>
            <h1 className="text-2xl font-medium leading-tight" style={{ color: WARM.text }}>
              {stationName}
            </h1>
          </div>
          <p className="text-xl tabular-nums" style={{ color: WARM.secondary }}>
            {timeStr}
          </p>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-4">
        {/* 2. Tình trạng xe buýt */}
        <section className="mb-6">
          <h2
            className="mb-3 text-base uppercase tracking-wide"
            style={{ color: WARM.secondary }}
          >
            Xe sắp đến
          </h2>
          <div className="space-y-4">
            {arrivals.map((route) => {
              const ctx = getEtaContext(route)
              return (
                <article
                  key={route.id}
                  className="rounded-2xl p-4"
                  style={{
                    backgroundColor: WARM.card,
                    boxShadow: WARM.cardShadow,
                  }}
                  role={matchesTaskDestination(route) ? 'button' : undefined}
                  tabIndex={matchesTaskDestination(route) ? 0 : undefined}
                  onClick={
                    matchesTaskDestination(route)
                      ? () => selectArrival(route)
                      : undefined
                  }
                  onKeyDown={
                    matchesTaskDestination(route)
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') selectArrival(route)
                        }
                      : undefined
                  }
                >
                  <div className="flex items-start gap-3">
                    <RouteTag routeId={route.id} color={WARM.primary} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-medium leading-snug">
                        Tuyến {route.id} → {getDestination(route)}
                      </p>
                      <p
                        className="mt-1 text-xl font-medium tabular-nums"
                        style={{ color: WARM.primary }}
                      >
                        {ctx.etaLabel}
                        <span className="text-base font-normal" style={{ color: WARM.muted }}>
                          {' '}
                          · {ctx.contextLabel}
                        </span>
                      </p>
                      <DelayReason
                        context={ctx}
                        onExpand={() => {
                          ensureTaskStart()
                          trackClick(`delay-detail-${route.id}`, true)
                        }}
                      />
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {/* 3. Simplified route map */}
        <section className="mb-6">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-base uppercase tracking-wide" style={{ color: WARM.secondary }}>
              Bản đồ tuyến
            </h2>
            <div className="flex gap-1.5">
              {arrivals.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => selectMapRoute(r)}
                  className="rounded-lg px-2.5 py-1 text-base transition-colors"
                  style={{
                    backgroundColor: mapRoute.id === r.id ? WARM.primary : WARM.card,
                    color: mapRoute.id === r.id ? '#FFFBF5' : WARM.secondary,
                    boxShadow: mapRoute.id === r.id ? 'none' : WARM.cardShadow,
                  }}
                >
                  {r.id}
                </button>
              ))}
            </div>
          </div>
          <div
            className="overflow-hidden rounded-2xl p-3"
            style={{ backgroundColor: WARM.card, boxShadow: WARM.cardShadow }}
          >
            <div className="h-44">
              <WarmMap route={mapRoute} />
            </div>
            <p className="mt-2 text-base" style={{ color: WARM.muted }}>
              Hiển thị trạm hiện tại và các điểm dừng gần trên tuyến {mapRoute.id}
            </p>
          </div>
        </section>

        {/* 4. Lịch trình đầy đủ — expandable */}
        <section className="mb-4">
          <button
            type="button"
            onClick={toggleSchedule}
            className="flex w-full items-center justify-between rounded-2xl px-4 py-4 text-left"
            style={{ backgroundColor: WARM.card, boxShadow: WARM.cardShadow }}
            aria-expanded={scheduleOpen}
          >
            <span className="text-lg font-medium">Lịch trình đầy đủ</span>
            <ChevronDown
              className={`h-5 w-5 shrink-0 transition-transform ${scheduleOpen ? 'rotate-180' : ''}`}
              style={{ color: WARM.primary }}
              aria-hidden
            />
          </button>

          {scheduleOpen && (
            <div
              className="mt-2 rounded-2xl px-4 py-3"
              style={{ backgroundColor: WARM.card, boxShadow: WARM.cardShadow }}
            >
              <p className="mb-3 text-base" style={{ color: WARM.muted }}>
                {mapRoute.name}
              </p>
              <ol className="space-y-3">
                {mapRoute.stops.map((stop, i) => {
                  const isCurrent = i === 0
                  return (
                    <li key={stop.id} className="flex items-start gap-3">
                      <span
                        className="mt-1.5 h-3 w-3 shrink-0 rounded-full"
                        style={{
                          backgroundColor: isCurrent ? WARM.primary : WARM.mapLine,
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className="text-lg leading-snug"
                          style={{
                            color: isCurrent ? WARM.primary : WARM.text,
                            fontWeight: isCurrent ? 500 : 400,
                          }}
                        >
                          {stop.name}
                          {isCurrent && (
                            <span className="ml-2 text-base" style={{ color: WARM.secondary }}>
                              (trạm này)
                            </span>
                          )}
                        </p>
                        {!isCurrent && (
                          <p className="text-base tabular-nums" style={{ color: WARM.muted }}>
                            ~{stop.nextArrival} phút từ trạm đầu
                          </p>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ol>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
