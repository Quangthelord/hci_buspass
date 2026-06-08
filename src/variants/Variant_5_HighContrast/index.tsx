import { useEffect, useMemo, useRef, useState } from 'react'
import { busRoutesData, type BusRouteData } from '../../data/busRoutes'
import { formatTime24 } from '../../lib/formatVi'
import { completeTask, logClick, startTask } from '../../lib/telemetry'
import { matchesTaskDestination } from '../../lib/taskGoal'
import { useMobileScroll } from '../../hooks/useMobileScroll'
import { AccessibleBusRow } from './AccessibleBusRow'
import { RouteDetail } from './RouteDetail'
import { getArrivalMinutes } from './busStatus'
import { A11Y, BOARD_DISPLAY, BODY_STYLE, TOUCH_MIN, VARIANT_ID } from './constants'

export interface Variant5Props {
  stationId?: string
  userId?: string
}

function getBoardEntries(): { route: BusRouteData; destination: string; minutes: number | null }[] {
  return BOARD_DISPLAY.map((row) => ({
    route: busRoutesData.routes.find((r) => r.id === row.routeId)!,
    destination: row.destination,
    minutes: row.minutes,
  })).filter((e) => e.route)
}

function getStationName(stationId: string): string {
  if (busRoutesData.station.id === stationId) return busRoutesData.station.name
  return busRoutesData.station.name
}

export default function Variant5HighContrast({
  stationId = 'ben-thanh',
  userId = 'participant-01',
}: Variant5Props) {
  useMobileScroll()
  const [now, setNow] = useState(new Date())
  const [selectedRoute, setSelectedRoute] = useState<BusRouteData | null>(null)
  const [plannerOpen, setPlannerOpen] = useState(false)
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

  const openRoute = (route: BusRouteData, displayDestination?: string) => {
    ensureTaskStart()
    trackClick(`bus-row-${route.id}`, true)
    setSelectedRoute(route)
    if (matchesTaskDestination(route, displayDestination)) {
      completeTask(VARIANT_ID, true)
    }
  }

  const boardEntries = useMemo(() => getBoardEntries(), [])

  const plannerRoutes = useMemo(
    () =>
      [...busRoutesData.routes]
        .filter((r) => r.stops[0]?.name === stationName)
        .sort((a, b) => (getArrivalMinutes(a) ?? 99) - (getArrivalMinutes(b) ?? 99)),
    [stationName],
  )

  const timeStr = formatTime24(now)

  if (selectedRoute) {
    return (
      <RouteDetail
        route={selectedRoute}
        onBack={() => {
          trackClick('detail-back', true)
          setSelectedRoute(null)
        }}
      />
    )
  }

  if (plannerOpen) {
    return (
      <div
        className="flex min-h-dvh flex-col font-sans"
        style={{ backgroundColor: A11Y.bg, color: A11Y.text, ...BODY_STYLE }}
      >
        <header className="border-b-2 px-5 py-4" style={{ borderColor: A11Y.border }}>
          <button
            type="button"
            onClick={() => {
              trackClick('planner-back', true)
              setPlannerOpen(false)
            }}
            className="flex items-center"
            style={{ minHeight: TOUCH_MIN, minWidth: TOUCH_MIN }}
          >
            Quay lại
          </button>
          <h1 className="mt-4" style={{ fontSize: '32px', lineHeight: 1.2 }}>
            Tìm lộ trình
          </h1>
          <p className="mt-2">Chọn tuyến từ trạm {stationName}</p>
        </header>

        <ol className="flex-1 overflow-y-auto">
          {plannerRoutes.map((route, i) => (
            <AccessibleBusRow
              key={route.id}
              index={i + 1}
              route={route}
              onSelect={() => openRoute(route)}
            />
          ))}
        </ol>
      </div>
    )
  }

  return (
    <div
      className="flex min-h-dvh flex-col font-sans"
      style={{ backgroundColor: A11Y.bg, color: A11Y.text, ...BODY_STYLE }}
    >
      {/* 1. Station header */}
      <header
        className="border-b-2 px-5 py-6"
        style={{ borderColor: A11Y.border }}
      >
        <p style={{ fontSize: '20px', marginBottom: '0.25rem' }}>TRẠM XE BUÝT</p>
        <div className="flex items-start justify-between gap-4">
          <h1 style={{ fontSize: '32px', lineHeight: 1.15 }}>{stationName}</h1>
          <time
            dateTime={now.toISOString()}
            className="tabular-nums"
            style={{ fontSize: '28px', lineHeight: 1.15 }}
          >
            {timeStr}
          </time>
        </div>
      </header>

      <main className="flex flex-1 flex-col px-5 py-6">
        {/* 2. Numbered bus list */}
        <h2
          className="border-b-2 pb-3"
          style={{ borderColor: A11Y.border, fontSize: '22px', marginBottom: '1rem' }}
        >
          Xe buýt sắp đến
        </h2>

        <ol className="flex-1">
          {boardEntries.map((entry, i) => (
            <AccessibleBusRow
              key={entry.route.id}
              index={i + 1}
              route={entry.route}
              destination={entry.destination}
              minutes={entry.minutes}
              onSelect={() => openRoute(entry.route, entry.destination)}
            />
          ))}
        </ol>

        {/* 3. Primary CTA */}
        <button
          type="button"
          onClick={() => {
            ensureTaskStart()
            trackClick('cta-tim-lo-trinh', true)
            setPlannerOpen(true)
          }}
          className="mt-6 w-full border-2 font-bold"
          style={{
            height: '64px',
            minHeight: TOUCH_MIN,
            backgroundColor: A11Y.buttonBg,
            color: A11Y.buttonText,
            borderColor: A11Y.border,
            fontSize: '22px',
            letterSpacing: '0.02em',
          }}
        >
          TÌM LỘ TRÌNH
        </button>
      </main>
    </div>
  )
}
