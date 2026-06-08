import { useMemo, useRef, useState, type ReactNode } from 'react'
import { busRoutesData, useLiveBusRoutes, type BusRouteData } from '../../data/busRoutes'
import { completeTask, logClick, startTask } from '../../lib/telemetry'
import { matchesTaskDestination, TASK_DESTINATION } from '../../lib/taskGoal'
import { useMobileScroll } from '../../hooks/useMobileScroll'
import type { CmScreen } from './constants'
import { VARIANT_ID } from './constants'
import { buildSuggestions } from './utils'
import {
  CmGoModeScreen,
  CmHomeScreen,
  CmPlannerScreen,
  CmRouteDetailScreen,
} from './CmScreens'
import './cmMapper.css'

export interface Variant2Props {
  stationId?: string
  userId?: string
}

function getStationName(stationId: string): string {
  if (busRoutesData.station.id === stationId) return busRoutesData.station.name
  return busRoutesData.station.name
}

export default function Variant2DarkTransit({
  stationId = 'ben-thanh',
  userId = 'participant-01',
}: Variant2Props) {
  useMobileScroll()

  const [screen, setScreen] = useState<CmScreen>('home')
  const [query, setQuery] = useState('')
  const [destination, setDestination] = useState(TASK_DESTINATION)
  const [selectedRoute, setSelectedRoute] = useState<BusRouteData | null>(null)
  const taskStarted = useRef(false)

  const stationName = getStationName(stationId)
  const liveRoutes = useLiveBusRoutes()

  const suggestions = useMemo(
    () => buildSuggestions(liveRoutes, destination || query),
    [liveRoutes, destination, query],
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

  const selectRoute = (route: BusRouteData, source: string) => {
    ensureTaskStart()
    trackClick(source, true)
    setSelectedRoute(route)
    setScreen('routeDetail')
    tryComplete(route)
  }

  const goToPlanner = (dest?: string) => {
    ensureTaskStart()
    if (dest) setDestination(dest)
    else if (query.trim()) setDestination(query.trim())
    setScreen('planner')
    trackClick('open-planner', true)
  }

  const shell = (child: ReactNode) => (
    <div className="cm-root flex min-h-dvh flex-col bg-white">{child}</div>
  )

  if (screen === 'planner') {
    return shell(
      <CmPlannerScreen
        start={stationName}
        end={destination}
        suggestions={suggestions}
        onBack={() => setScreen('home')}
        onSwap={() => {
          trackClick('swap-locations', true)
          setDestination(stationName)
        }}
        onSelectRoute={(r) => selectRoute(r, `suggested-${r.id}`)}
        onEndChange={(q) => {
          setDestination(q)
          trackClick('planner-destination', true)
        }}
        onSearchFocus={() => {
          ensureTaskStart()
          trackClick('planner-search', true)
        }}
      />,
    )
  }

  if (screen === 'routeDetail' && selectedRoute) {
    return shell(
      <CmRouteDetailScreen
        route={selectedRoute}
        stationName={stationName}
        onBack={() => setScreen('planner')}
        onGo={() => {
          trackClick('go-button', true)
          setScreen('goMode')
        }}
        onStopClick={(id) => trackClick(`stop-${id}`, true)}
      />,
    )
  }

  if (screen === 'goMode' && selectedRoute) {
    return shell(
      <CmGoModeScreen
        route={selectedRoute}
        onClose={() => setScreen('routeDetail')}
        onStopClick={(id) => trackClick(`go-stop-${id}`, true)}
      />,
    )
  }

  return shell(
    <CmHomeScreen
      query={query}
      stationName={stationName}
      onQueryChange={(q) => {
        setQuery(q)
        trackClick('home-search', true)
      }}
      onSearchSubmit={() => goToPlanner(query.trim() || TASK_DESTINATION)}
      onModeSelect={(mode) => {
        trackClick(`mode-${mode}`, true)
        if (mode === 'bus' || mode === 'all') goToPlanner(TASK_DESTINATION)
      }}
      onCommuteTap={() => goToPlanner(TASK_DESTINATION)}
      onSearchFocus={() => {
        ensureTaskStart()
        trackClick('search-focus', true)
      }}
    />,
  )
}
