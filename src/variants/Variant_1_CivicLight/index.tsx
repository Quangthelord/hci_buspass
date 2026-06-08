import { useEffect, useMemo, useRef, useState } from 'react'
import { busRoutesData, useLiveBusRoutes, type BusRouteData } from '../../data/busRoutes'
import { formatDelayStatus, formatRouteLabel, formatTime24 } from '../../lib/formatVi'
import { completeTask, logClick, startTask } from '../../lib/telemetry'
import { matchesTaskDestination } from '../../lib/taskGoal'
import { useMobileScroll } from '../../hooks/useMobileScroll'
import { SearchBar } from '../../components/shared/SearchBar'
import { RouteTag } from '../../components/shared/RouteTag'
import { CIVIC, HCMC_ROUTE_COLORS, VARIANT_ID } from './constants'
import { RouteDetail } from './RouteDetail'

export interface Variant1Props {
  stationId?: string
  userId?: string
}

function getStationName(stationId: string): string {
  if (busRoutesData.station.id === stationId) return busRoutesData.station.name
  return busRoutesData.station.name
}

function getDestination(route: BusRouteData): string {
  return route.stops[route.stops.length - 1]?.name ?? '—'
}

function getFrequency(route: BusRouteData): string {
  const first = route.stops[0]
  const gap = Math.max(first.nextNextArrival - first.nextArrival, 5)
  return `~${gap} phút/chuyến`
}

function getArrivalMinutes(route: BusRouteData): number {
  return route.stops[0].nextArrival + route.currentDelay
}

export default function Variant1CivicLight({
  stationId = 'ben-thanh',
  userId = 'participant-01',
}: Variant1Props) {
  useMobileScroll()
  const [now, setNow] = useState(new Date())
  const [query, setQuery] = useState('')
  const [selectedRoute, setSelectedRoute] = useState<BusRouteData | null>(null)
  const taskStarted = useRef(false)

  const stationName = getStationName(stationId)

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

  const openRouteDetail = (route: BusRouteData, source: string) => {
    ensureTaskStart()
    trackClick(source, true)
    setSelectedRoute(route)
    if (matchesTaskDestination(route)) {
      completeTask(VARIANT_ID, true)
    }
  }

  const liveRoutes = useLiveBusRoutes()

  const routes = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return liveRoutes
    return liveRoutes.filter(
      (r) =>
        r.id.includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.stops.some((s) => s.name.toLowerCase().includes(q)),
    )
  }, [query, liveRoutes])

  const arrivals = useMemo(
    () =>
      [...liveRoutes]
        .sort((a, b) => getArrivalMinutes(a) - getArrivalMinutes(b))
        .slice(0, 3),
    [liveRoutes],
  )

  const timeStr = formatTime24(now)

  if (selectedRoute) {
    return (
      <RouteDetail
        route={selectedRoute}
        onBack={() => {
          trackClick('detail-back-close', true)
          setSelectedRoute(null)
        }}
        onStopClick={(target) => trackClick(target, true)}
      />
    )
  }

  return (
    <div
      className="flex min-h-dvh flex-col bg-white font-sans text-[#111827]"
      style={{ backgroundColor: CIVIC.bg, color: CIVIC.text, fontSize: '18px' }}
    >
      {/* 1. Top bar */}
      <header className="flex items-start justify-between border-b border-[#E5E7EB] px-5 py-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-gray-500">Trạm hiện tại</p>
          <h1 className="text-2xl font-bold leading-tight">{stationName}</h1>
        </div>
        <p className="text-2xl font-bold tabular-nums text-[#111827]">{timeStr}</p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-4">
        {/* 2. Search */}
        <div
          className="mb-6"
          onPointerDown={() => {
            ensureTaskStart()
            trackClick('search-bar', true)
          }}
        >
          <SearchBar
            size="large"
            placeholder="Tìm điểm đến (vd: Suối Tiên)"
            onSearch={(q) => {
              setQuery(q)
              trackClick('search-input', true)
            }}
          />
        </div>

        {/* 3. Xe buýt sắp đến */}
        <section className="mb-6">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-500">
            Xe buýt sắp đến
          </h2>
          <div className="space-y-3">
            {arrivals.map((route) => {
              const color = HCMC_ROUTE_COLORS[route.id] ?? route.color
              const minutes = getArrivalMinutes(route)
              const delayed = route.currentDelay > 0
              return (
                <button
                  key={route.id}
                  type="button"
                  onClick={() => openRouteDetail(route, `arrival-card-${route.id}`)}
                  onPointerDown={() => {
                    ensureTaskStart()
                    trackClick(`route-tag-${route.id}`, true)
                  }}
                  className="flex w-full items-center gap-4 rounded-xl border border-[#E5E7EB] bg-white p-4 text-left"
                >
                  <RouteTag routeId={route.id} color={color} size="lg" />
                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-bold">
                      {formatRouteLabel(route.id)} → {getDestination(route)}
                    </p>
                    <p className={`text-base font-semibold ${delayed ? 'text-[#EA580C]' : 'text-[#16A34A]'}`}>
                      {formatDelayStatus(route.currentDelay)}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p
                      className={`text-3xl font-bold tabular-nums ${delayed ? 'text-[#EA580C]' : 'text-[#16A34A]'}`}
                    >
                      {minutes}
                    </p>
                    <p className="text-sm font-semibold text-gray-500">phút</p>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* 4. Chọn tuyến */}
        <section className="mb-4 min-h-0 flex-1">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-500">Chọn tuyến</h2>
          <ul className="space-y-2 overflow-y-auto">
            {routes.map((route) => {
              const color = HCMC_ROUTE_COLORS[route.id] ?? route.color
              return (
                <li key={route.id}>
                  <button
                    type="button"
                    onClick={() => openRouteDetail(route, `route-list-${route.id}`)}
                    onPointerDown={() => {
                      ensureTaskStart()
                      trackClick(`route-tag-list-${route.id}`, true)
                    }}
                    className="flex w-full items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-left"
                  >
                    <RouteTag routeId={route.id} color={color} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-bold leading-snug">{route.name}</p>
                      <p className="text-base text-gray-500">{getFrequency(route)}</p>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      </div>

      {/* 5. Bottom CTA */}
      <footer className="shrink-0 border-t border-[#E5E7EB] bg-white p-5">
        <button
          type="button"
          onClick={() => {
            ensureTaskStart()
            trackClick('cta-trip-planner', true)
          }}
          className="w-full rounded-xl bg-[#16A34A] py-4 text-xl font-bold text-white"
        >
          Tìm lộ trình
        </button>
      </footer>
    </div>
  )
}
