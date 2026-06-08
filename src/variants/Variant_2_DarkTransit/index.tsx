import { useEffect, useMemo, useRef, useState } from 'react'
import { busRoutesData, useLiveBusRoutes, type BusRouteData } from '../../data/busRoutes'
import { matchesTaskDestination } from '../../lib/taskGoal'
import { completeTask, logClick, startTask } from '../../lib/telemetry'
import { useMobileScroll } from '../../hooks/useMobileScroll'
import { BottomSheet } from './BottomSheet'
import { DarkMap } from './DarkMap'
import { DARK, VARIANT_ID } from './constants'

export interface Variant2Props {
  stationId?: string
  userId?: string
}

function getDestination(route: BusRouteData): string {
  return route.stops[route.stops.length - 1]?.name ?? '—'
}

export default function Variant2DarkTransit({
  stationId = 'ben-thanh',
  userId = 'participant-01',
}: Variant2Props) {
  useMobileScroll()
  const liveRoutes = useLiveBusRoutes()
  const [routeId, setRouteId] = useState('01')
  const [sheetExpanded, setSheetExpanded] = useState(false)
  const [taskDone, setTaskDone] = useState(false)
  const taskStarted = useRef(false)

  const stationName = useMemo(() => {
    if (busRoutesData.station.id === stationId) return busRoutesData.station.name
    return busRoutesData.station.name
  }, [stationId])

  const route = useMemo(
    () => liveRoutes.find((r) => r.id === routeId) ?? liveRoutes[0],
    [liveRoutes, routeId],
  )

  const destination = route ? getDestination(route) : '—'

  const ensureTaskStart = () => {
    if (!taskStarted.current) {
      taskStarted.current = true
      startTask(VARIANT_ID, userId)
    }
  }

  const trackClick = (target: string, isHit = true) => {
    logClick(VARIANT_ID, target, isHit)
  }

  const expandSheet = () => {
    ensureTaskStart()
    trackClick('bottom-sheet-expand', true)
    setSheetExpanded(true)
    if (route && !taskDone && matchesTaskDestination(route)) {
      completeTask(VARIANT_ID, true)
      setTaskDone(true)
    }
  }

  const toggleSheet = () => {
    if (sheetExpanded) {
      trackClick('bottom-sheet-collapse', true)
      setSheetExpanded(false)
    } else {
      expandSheet()
    }
  }

  useEffect(() => {
    document.body.classList.add('variant-dark-transit')
    return () => document.body.classList.remove('variant-dark-transit')
  }, [])

  if (!route) {
    return (
      <div
        className="flex h-dvh items-center justify-center font-sans"
        style={{ backgroundColor: DARK.bg, color: DARK.text }}
      >
        <p>Đang tải dữ liệu tuyến…</p>
      </div>
    )
  }

  return (
    <div
      className="relative flex h-dvh w-full flex-col overflow-hidden font-sans font-normal"
      style={{ backgroundColor: DARK.bg, color: DARK.text }}
    >
      {/* Map area */}
      <div className="relative min-h-0 flex-1">
        <div className="absolute inset-0">
          <DarkMap routeColor={DARK.cyan} />
        </div>

        {/* Top overlay — station + route switcher */}
        <div
          className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-4 py-3"
          style={{ background: 'linear-gradient(180deg, rgba(26,26,46,0.9) 0%, transparent 100%)' }}
        >
          <div>
            <p className="text-xs" style={{ color: DARK.muted }}>
              {stationName}
            </p>
            <p className="text-sm font-normal" style={{ color: DARK.text }}>
              Dark Transit
            </p>
          </div>
          <div className="flex gap-1">
            {liveRoutes.slice(0, 4).map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  ensureTaskStart()
                  trackClick(`route-tag-${r.id}`, true)
                  setRouteId(r.id)
                  if (!taskDone && matchesTaskDestination(r)) {
                    completeTask(VARIANT_ID, true)
                    setTaskDone(true)
                  }
                }}
                className="rounded-md px-2 py-1 text-xs font-normal"
                style={{
                  backgroundColor: routeId === r.id ? DARK.cyan : DARK.card,
                  color: routeId === r.id ? DARK.bg : DARK.text,
                  boxShadow: routeId === r.id ? `0 0 8px ${DARK.cyan}` : 'none',
                }}
              >
                {r.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      <BottomSheet
        route={route}
        expanded={sheetExpanded}
        onToggle={toggleSheet}
        onSearchFocus={() => {
          ensureTaskStart()
          trackClick('journey-search', true)
        }}
        onRouteSelect={(target) => trackClick(target, true)}
        destination={destination}
      />
    </div>
  )
}
