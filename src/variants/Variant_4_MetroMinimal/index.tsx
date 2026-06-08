import { useMemo, useRef, useState, type ReactNode } from 'react'
import { busRoutesData, useLiveBusRoutes, type BusRouteData } from '../../data/busRoutes'
import { completeTask, logClick, startTask } from '../../lib/telemetry'
import { matchesTaskDestination, TASK_DESTINATION } from '../../lib/taskGoal'
import { useMobileScroll } from '../../hooks/useMobileScroll'
import type { MvScreen } from './constants'
import { ORIGIN_ADDRESS, VARIANT_ID } from './constants'
import { MvNearbyScreen, MvPlannerScreen, MvRouteDetailScreen } from './MvScreens'
import { getRouteOptions, type RouteOption } from './routeOptions'
import './moovit.css'

export interface Variant4Props {
  stationId?: string
  userId?: string
}

function getStationName(stationId: string): string {
  if (busRoutesData.station.id === stationId) return busRoutesData.station.name
  return busRoutesData.station.name
}

export default function Variant4MetroMinimal({
  stationId = 'ben-thanh',
  userId = 'participant-01',
}: Variant4Props) {
  useMobileScroll()

  const [screen, setScreen] = useState<MvScreen>('nearby')
  const [nearbyTab, setNearbyTab] = useState<'nearby' | 'favorites'>('nearby')
  const [origin, setOrigin] = useState(ORIGIN_ADDRESS)
  const [destination, setDestination] = useState('')
  const [selectedOption, setSelectedOption] = useState<RouteOption | null>(null)
  const taskStarted = useRef(false)

  const stationName = getStationName(stationId)
  const liveRoutes = useLiveBusRoutes()

  const nearbyRoutes = useMemo(
    () => liveRoutes.filter((r) => r.stops[0]?.name === stationName || r.stops.some((s) => s.name === stationName)),
    [liveRoutes, stationName],
  )

  const routeOptions = useMemo(
    () => (destination.trim() ? getRouteOptions(destination.trim()) : []),
    [destination],
  )

  const ensureTaskStart = () => {
    if (!taskStarted.current) {
      taskStarted.current = true
      startTask(VARIANT_ID, userId)
    }
  }

  const trackClick = (target: string, isHit = true) => {
    logClick(VARIANT_ID, target, isHit)
  }

  const tryComplete = (route: BusRouteData) => {
    if (matchesTaskDestination(route)) {
      completeTask(VARIANT_ID, true)
    }
  }

  const openPlanner = (dest?: string) => {
    ensureTaskStart()
    if (dest) setDestination(dest)
    setScreen('planner')
    trackClick('open-planner', true)
  }

  const selectRoute = (opt: RouteOption, source: string) => {
    ensureTaskStart()
    trackClick(source, true)
    setSelectedOption(opt)
    setScreen('routeDetail')
    tryComplete(opt.route)
  }

  const selectNearbyRoute = (route: BusRouteData) => {
    ensureTaskStart()
    trackClick(`nearby-route-${route.id}`, true)
    const dest = route.stops[route.stops.length - 1].name
    setDestination(dest)
    const options = getRouteOptions(dest)
    const opt = options.find((o) => o.route.id === route.id) ?? options[0]
    if (opt) selectRoute(opt, `nearby-${route.id}`)
  }

  const shell = (child: ReactNode) => (
    <div className="mv-root flex min-h-dvh flex-col bg-white">{child}</div>
  )

  if (screen === 'routeDetail' && selectedOption) {
    return shell(
      <MvRouteDetailScreen
        option={selectedOption}
        destination={destination || TASK_DESTINATION}
        stationName={stationName}
        onBack={() => setScreen('planner')}
        onStopClick={(id) => trackClick(`stop-${id}`, true)}
      />,
    )
  }

  if (screen === 'planner') {
    return shell(
      <MvPlannerScreen
        origin={origin}
        destination={destination}
        routeOptions={routeOptions}
        onBack={() => setScreen('nearby')}
        onSwap={() => {
          trackClick('swap-locations', true)
          const prev = origin
          setOrigin(destination || stationName)
          setDestination(prev === ORIGIN_ADDRESS ? '' : prev)
        }}
        onOriginChange={(v) => {
          setOrigin(v)
          trackClick('planner-origin', true)
        }}
        onDestinationChange={(v) => {
          ensureTaskStart()
          setDestination(v)
          trackClick('planner-destination', true)
        }}
        onSelectRoute={(opt) => selectRoute(opt, `suggested-${opt.route.id}`)}
        onSearchFocus={() => ensureTaskStart()}
      />,
    )
  }

  return shell(
    <MvNearbyScreen
      stationName={stationName}
      nearbyRoutes={nearbyRoutes.length > 0 ? nearbyRoutes : liveRoutes.slice(0, 4)}
      tab={nearbyTab}
      onTabChange={(t) => {
        setNearbyTab(t)
        trackClick(`tab-${t}`, true)
      }}
      onRouteTap={selectNearbyRoute}
      onDirections={() => openPlanner()}
      onMap={() => trackClick('nav-map', true)}
      onRoutes={() => openPlanner(TASK_DESTINATION)}
    />,
  )
}
