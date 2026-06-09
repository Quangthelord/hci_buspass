import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { busRoutesData, useLiveBusRoutes, type BusRouteData } from '../../data/busRoutes'
import { completeTask, logClick, startTask } from '../../lib/telemetry'
import { findTaskRoute, matchesTaskDestination } from '../../lib/taskGoal'
import { useMobileScroll } from '../../hooks/useMobileScroll'
import { useKioskIdleReset } from '../../hooks/useKioskIdleReset'
import type { BpLang, BpScreen } from './constants'
import { VARIANT_ID } from './constants'
import { BpHelpScreen, BpHomeScreen, BpQrScreen, BpRouteScreen } from './BpScreens'
import { BpDashboard } from './BpDashboard'

export function BusPassFlow({
  stationId = 'ben-thanh',
  userId = 'participant-01',
}: {
  stationId?: string
  userId?: string
}) {
  useMobileScroll()

  const [screen, setScreen] = useState<BpScreen>('home')
  const [lang, setLang] = useState<BpLang>('vi')
  const [dashboardView, setDashboardView] = useState<'map' | 'list'>('map')
  const [selectedRoute, setSelectedRoute] = useState<BusRouteData | null>(null)
  const [destination, setDestination] = useState('')
  const taskStarted = useRef(false)
  const taskDone = useRef(false)
  const helpReturnScreen = useRef<BpScreen>('map')

  const liveRoutes = useLiveBusRoutes()
  const stationName = busRoutesData.station.name

  const stationRoutes = useMemo(
    () => liveRoutes.filter((r) => r.stops[0]?.name === stationName),
    [liveRoutes, stationName],
  )

  const ensureTaskStart = () => {
    if (!taskStarted.current) {
      taskStarted.current = true
      startTask(VARIANT_ID, userId)
    }
  }

  const track = (target: string) => {
    ensureTaskStart()
    logClick(VARIANT_ID, target, true)
  }

  const tryComplete = (route: BusRouteData) => {
    if (taskDone.current || !matchesTaskDestination(route)) return
    completeTask(VARIANT_ID, true)
    taskDone.current = true
  }

  const pickRoute = (route: BusRouteData, dest?: string) => {
    setSelectedRoute(route)
    if (dest) setDestination(dest)
    tryComplete(route)
  }

  function getRouteDest(route: BusRouteData) {
    return route.stops[route.stops.length - 1]?.name ?? ''
  }

  const goHome = useCallback(() => {
    setScreen('home')
    setSelectedRoute(null)
    setDestination('')
    setDashboardView('map')
  }, [])

  const goRoute = (route: BusRouteData) => {
    track(`route-${route.id}`)
    pickRoute(route, getRouteDest(route))
    setScreen('route')
  }

  const goThanks = (route?: BusRouteData) => {
    const r = route ?? selectedRoute ?? findTaskRoute(liveRoutes)
    if (!r) return
    track(`sync-done-${r.id}`)
    pickRoute(r, destination || getRouteDest(r))
    setScreen('qr')
  }

  useKioskIdleReset(screen === 'map', goHome, 90_000)
  useKioskIdleReset(screen === 'route', goHome, 60_000)
  useKioskIdleReset(screen === 'help', goHome, 120_000)

  useEffect(() => {
    if ((screen === 'route' || screen === 'qr') && !selectedRoute) {
      setScreen('map')
    }
  }, [screen, selectedRoute])

  let content: ReactNode = null
  let screenClass = 'bp-screen bp-screen--scroll d6-root flex min-h-dvh flex-col font-sans'

  if (screen === 'home') {
    screenClass = 'bp-screen bp-screen--welcome d6-root flex min-h-dvh flex-col font-sans'
    const routeIds = (stationRoutes.length > 0 ? stationRoutes : liveRoutes).map((r) => r.id)
    content = (
      <BpHomeScreen
        lang={lang}
        stationName={stationName}
        routeIds={routeIds}
        onLang={(l) => {
          track(`lang-${l}`)
          setLang(l)
          setScreen('map')
        }}
        onHelp={() => {
          track('help-from-home')
          helpReturnScreen.current = 'home'
          setScreen('help')
        }}
      />
    )
  } else if (screen === 'map') {
    screenClass = 'bp-screen bp-screen--dashboard d6-root flex min-h-dvh flex-col font-sans'
    content = (
      <BpDashboard
        lang={lang}
        stationName={stationName}
        stationId={stationId}
        userId={userId}
        routes={stationRoutes.length > 0 ? stationRoutes : liveRoutes}
        viewMode={dashboardView}
        onViewModeChange={setDashboardView}
        onRoute={goRoute}
        onHelp={() => {
          helpReturnScreen.current = 'map'
          setScreen('help')
        }}
        onBack={goHome}
      />
    )
  } else if (screen === 'route' && selectedRoute) {
    screenClass = 'bp-screen bp-screen--route d6-root flex min-h-dvh flex-col font-sans'
    content = (
      <BpRouteScreen
        lang={lang}
        route={selectedRoute}
        stationName={stationName}
        stationId={stationId}
        onComplete={() => goThanks(selectedRoute)}
        onBack={() => setScreen('map')}
      />
    )
  } else if (screen === 'qr' && selectedRoute) {
    screenClass = 'bp-screen bp-screen--qr d6-root flex min-h-dvh flex-col font-sans'
    content = (
      <BpQrScreen
        lang={lang}
        route={selectedRoute}
        destination={destination || getRouteDest(selectedRoute)}
        stationId={stationId}
        stationName={stationName}
        onBack={() => setScreen('route')}
        onDone={() => {
          track('qr-done')
          tryComplete(selectedRoute)
          goHome()
        }}
      />
    )
  } else if (screen === 'help') {
    screenClass = 'bp-screen bp-screen--help d6-root flex min-h-dvh flex-col font-sans'
    content = (
      <BpHelpScreen
        lang={lang}
        stationName={stationName}
        onBack={() => setScreen(helpReturnScreen.current)}
      />
    )
  } else {
    screenClass = 'bp-screen bp-screen--dashboard d6-root flex min-h-dvh flex-col font-sans'
    content = (
      <BpDashboard
        lang={lang}
        stationName={stationName}
        stationId={stationId}
        userId={userId}
        routes={stationRoutes.length > 0 ? stationRoutes : liveRoutes}
        viewMode={dashboardView}
        onViewModeChange={setDashboardView}
        onRoute={goRoute}
        onHelp={() => {
          helpReturnScreen.current = 'map'
          setScreen('help')
        }}
        onBack={goHome}
      />
    )
  }

  return <div className={screenClass}>{content}</div>
}
