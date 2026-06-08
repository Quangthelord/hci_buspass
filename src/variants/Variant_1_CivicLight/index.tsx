import { useMemo, useRef, useState, type ReactNode } from 'react'
import { busRoutesData, useLiveBusRoutes, type BusRouteData } from '../../data/busRoutes'
import { completeTask, logClick, startTask } from '../../lib/telemetry'
import { matchesTaskDestination } from '../../lib/taskGoal'
import { useMobileScroll } from '../../hooks/useMobileScroll'
import type { MtScreen, TransportMode } from './constants'
import { VARIANT_ID } from './constants'
import {
  MtAnnouncementsScreen,
  MtBusRouteScreen,
  MtHomeScreen,
  MtJourneyScreen,
  MtLiveMapScreen,
  MtMrtScreen,
  MtNearYouScreen,
} from './MtScreens'
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

  const [screen, setScreen] = useState<MtScreen>('home')
  const [mode, setMode] = useState<TransportMode>('bus')
  const [query, setQuery] = useState('')
  const [stopExpanded, setStopExpanded] = useState(true)
  const [selectedRoute, setSelectedRoute] = useState<BusRouteData | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [returnScreen, setReturnScreen] = useState<MtScreen>('home')
  const taskStarted = useRef(false)

  const stationName = getStationName(stationId)
  const liveRoutes = useLiveBusRoutes()

  const routes = useMemo(() => [...liveRoutes], [liveRoutes, refreshKey])

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
    tryComplete(route)
  }

  const openLiveMap = (route: BusRouteData, source: string) => {
    ensureTaskStart()
    trackClick(source, true)
    setReturnScreen(screen)
    setSelectedRoute(route)
    setScreen('liveMap')
    tryComplete(route)
  }

  const goHome = () => {
    setScreen('home')
    setMode('bus')
  }

  const onSearchFocus = () => {
    ensureTaskStart()
    trackClick('search-bar', true)
  }

  const onQueryChange = (q: string) => {
    setQuery(q)
    trackClick('search-input', true)
    if (q.trim()) ensureTaskStart()
  }

  const shell = (child: ReactNode) => (
    <div className="mt-sg-root flex min-h-dvh flex-col">{child}</div>
  )

  if (mode === 'mrt' && screen === 'home') {
    return shell(<MtMrtScreen onBack={() => setMode('bus')} />)
  }

  if (screen === 'nearYou') {
    return shell(
      <MtNearYouScreen
        stopName={stationName}
        routes={routes}
        query={query}
        stopExpanded={stopExpanded}
        onQueryChange={onQueryChange}
        onClose={goHome}
        onToggleStop={() => {
          trackClick('stop-toggle', true)
          setStopExpanded((e) => !e)
        }}
        onSelectRoute={(r) => openLiveMap(r, `near-select-${r.id}`)}
        onViewMap={(r) => openLiveMap(r, `near-viewmap-${r.id}`)}
        onRefresh={() => setRefreshKey((k) => k + 1)}
        onSearchFocus={onSearchFocus}
      />,
    )
  }

  if (screen === 'liveMap' && selectedRoute) {
    return shell(
      <MtLiveMapScreen
        route={selectedRoute}
        stopName={stationName}
        onBack={() => setScreen(returnScreen === 'nearYou' ? 'nearYou' : 'home')}
        onViewRoute={() => {
          trackClick('view-bus-route', true)
          setScreen('busRoute')
        }}
        onSelectRoute={() => selectRoute(selectedRoute, `livemap-service-${selectedRoute.id}`)}
      />,
    )
  }

  if (screen === 'busRoute' && selectedRoute) {
    return shell(
      <MtBusRouteScreen
        route={selectedRoute}
        onBack={() => setScreen('liveMap')}
        onStopClick={(id) => trackClick(`stop-${id}`, true)}
      />,
    )
  }

  if (screen === 'announcements') {
    return shell(<MtAnnouncementsScreen onBack={goHome} />)
  }

  if (screen === 'journey') {
    return shell(
      <MtJourneyScreen
        query={query}
        onQueryChange={onQueryChange}
        onBack={goHome}
        onSearchFocus={onSearchFocus}
      />,
    )
  }

  return shell(
    <MtHomeScreen
      stopName={stationName}
      routes={routes}
      query={query}
      mode={mode}
      stopExpanded={stopExpanded}
      onQueryChange={onQueryChange}
      onModeChange={(m) => {
        trackClick(`mode-${m}`, true)
        setMode(m)
      }}
      onToggleStop={() => {
        trackClick('stop-toggle', true)
        setStopExpanded((e) => !e)
      }}
      onSelectRoute={(r) => openLiveMap(r, `home-select-${r.id}`)}
      onViewMap={(r) => openLiveMap(r, `home-viewmap-${r.id}`)}
      onNearYou={() => {
        ensureTaskStart()
        trackClick('near-you-drawer', true)
        setScreen('nearYou')
      }}
      onAnnouncements={() => {
        trackClick('announcements', true)
        setScreen('announcements')
      }}
      onJourney={() => {
        trackClick('journey-planner', true)
        setScreen('journey')
      }}
      onSearchFocus={onSearchFocus}
    />,
  )
}
