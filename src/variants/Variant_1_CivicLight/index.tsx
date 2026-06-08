import { useMemo, useRef, useState } from 'react'
import { busRoutesData, useLiveBusRoutes, type BusRouteData } from '../../data/busRoutes'
import { completeTask, logClick, startTask } from '../../lib/telemetry'
import { matchesTaskDestination } from '../../lib/taskGoal'
import { useMobileScroll } from '../../hooks/useMobileScroll'
import { MtHeader } from './MtHeader'
import { MtSearchBar } from './MtSearchBar'
import { MtTabBar, type Tab } from './MtTabBar'
import { MtBusStopHeader } from './MtBusStopHeader'
import { MtArrivalRow, MtOccupancyLegend } from './MtArrivalRow'
import { MtBottomNav } from './MtBottomNav'
import { RouteDetail } from './RouteDetail'
import { VARIANT_ID } from './constants'
import { getDestination } from './utils'
import './mtSg.css'

export interface Variant1Props {
  stationId?: string
  userId?: string
}

function getStationName(stationId: string): string {
  if (busRoutesData.station.id === stationId) return busRoutesData.station.name
  return busRoutesData.station.name
}

export default function Variant1CivicLight({
  stationId = 'ben-thanh',
  userId = 'participant-01',
}: Variant1Props) {
  useMobileScroll()
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<Tab>('bus')
  const [selectedRoute, setSelectedRoute] = useState<BusRouteData | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const taskStarted = useRef(false)

  const stationName = getStationName(stationId)
  const liveRoutes = useLiveBusRoutes()

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

  const routes = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = [...liveRoutes]
    if (!q) return list
    return list.filter(
      (r) =>
        r.id.includes(q) ||
        r.name.toLowerCase().includes(q) ||
        getDestination(r).toLowerCase().includes(q) ||
        r.stops.some((s) => s.name.toLowerCase().includes(q)),
    )
  }, [query, liveRoutes, refreshKey])

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
      className="mt-sg-root flex min-h-dvh flex-col"
      style={{ backgroundColor: '#F5F5F5', color: '#212121' }}
    >
      <MtHeader onRefresh={() => setRefreshKey((k) => k + 1)} />

      <div className="shrink-0 px-4 pb-2 pt-3">
        <div
          onPointerDown={() => {
            ensureTaskStart()
            trackClick('search-bar', true)
          }}
        >
          <MtSearchBar
            value={query}
            onChange={(q) => {
              setQuery(q)
              trackClick('search-input', true)
            }}
            placeholder="Search destination (e.g. Suối Tiên)"
          />
        </div>
      </div>

      <MtTabBar active={tab} onChange={setTab} />

      {tab === 'bus' ? (
        <>
          <MtBusStopHeader stopName={stationName} />

          <div className="min-h-0 flex-1 overflow-y-auto bg-white">
            {routes.length === 0 ? (
              <p className="px-4 py-8 text-center text-[#757575]">No matching bus services</p>
            ) : (
              routes.map((route) => (
                <MtArrivalRow
                  key={route.id}
                  route={route}
                  onSelect={() => openRouteDetail(route, `arrival-row-${route.id}`)}
                />
              ))
            )}
          </div>

          <MtOccupancyLegend />
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 bg-white px-6 text-center">
          <p className="text-lg font-bold text-[#212121]">
            {tab === 'mrt' ? 'MRT / LRT' : 'Journey Planner'}
          </p>
          <p className="text-sm text-[#757575]">
            {tab === 'mrt'
              ? 'Train network map — switch to Bus tab for this study task.'
              : 'Plan multi-modal trips — use Bus tab to find services to Suối Tiên.'}
          </p>
          <button
            type="button"
            onClick={() => setTab('bus')}
            className="mt-4 rounded-full bg-[#009B3A] px-6 py-2.5 text-sm font-bold text-white"
          >
            View Bus Arrivals
          </button>
        </div>
      )}

      <MtBottomNav />
    </div>
  )
}
