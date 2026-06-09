import { useMemo, useRef, useState, type ReactNode } from 'react'
import { busRoutesData, useLiveBusRoutes, type BusRouteData } from '../../data/busRoutes'
import { completeTask, logClick, startTask } from '../../lib/telemetry'
import {
  findTaskRoute,
  matchesTaskDestination,
  TASK_DESTINATION,
  TASK_ROUTE_ID,
} from '../../lib/taskGoal'
import { useMobileScroll } from '../../hooks/useMobileScroll'
import BusPassSignaturePage from '../../app/page'
import type { BpLang, BpScreen } from './constants'
import { VARIANT_ID } from './constants'
import {
  BpHelpScreen,
  BpHomeScreen,
  BpListScreen,
  BpModeScreen,
  BpQrScreen,
  BpRouteScreen,
} from './BpScreens'
import { BpInteractionMenu } from './BpInteractionMenu'

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
  const [selectedRoute, setSelectedRoute] = useState<BusRouteData | null>(null)
  const [destination, setDestination] = useState('')
  const taskStarted = useRef(false)
  const taskDone = useRef(false)

  const liveRoutes = useLiveBusRoutes()
  const stationName =
    busRoutesData.station.id === stationId
      ? busRoutesData.station.name
      : busRoutesData.station.name

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

  const goRoute = (route: BusRouteData) => {
    track(`route-${route.id}`)
    pickRoute(route, getRouteDest(route))
    setScreen('route')
  }

  const goSync = (route?: BusRouteData) => {
    const r = route ?? selectedRoute ?? findTaskRoute(liveRoutes)
    if (!r) return
    track(`sync-${r.id}`)
    pickRoute(r, destination || TASK_DESTINATION)
    setScreen('qr')
  }

  function getRouteDest(route: BusRouteData) {
    return route.stops[route.stops.length - 1]?.name ?? ''
  }

  const goHome = () => {
    setScreen('home')
    setSelectedRoute(null)
    setDestination('')
  }

  const menuProps = {
    lang,
    screen,
    onHelp: () => setScreen('help'),
    onList: () => setScreen('list'),
    onMap: () => setScreen('map'),
    onTrack: track,
  }

  let content: ReactNode = null
  let screenClass = 'bp-screen bp-screen--scroll d6-root flex min-h-dvh flex-col font-sans'

  if (screen === 'home') {
    content = (
      <BpHomeScreen
        lang={lang}
        stationName={stationName}
        routeCount={stationRoutes.length || liveRoutes.length}
        onLang={(l) => {
          track(`lang-${l}`)
          setLang(l)
          setScreen('mode')
        }}
        onHelp={() => {
          track('help-from-home')
          setScreen('help')
        }}
      />
    )
  } else if (screen === 'mode') {
    content = (
      <BpModeScreen
        lang={lang}
        onBack={goHome}
        onMap={() => {
          track('mode-map')
          setScreen('map')
        }}
        onList={() => {
          track('mode-list')
          setScreen('list')
        }}
        onTrip={() => {
          track('mode-trip-suoi-tien')
          setDestination(TASK_DESTINATION)
          const taskRoute = findTaskRoute(liveRoutes)
          if (taskRoute) {
            setSelectedRoute(taskRoute)
            setScreen('map')
          } else {
            setScreen('map')
          }
        }}
      />
    )
  } else if (screen === 'list') {
    screenClass = 'bp-screen bp-screen--scroll d6-root relative flex min-h-dvh flex-col font-sans'
    content = (
      <BpListScreen
        lang={lang}
        routes={stationRoutes.length > 0 ? stationRoutes : liveRoutes}
        onRoute={goRoute}
        onMap={() => setScreen('map')}
        onBack={() => setScreen('mode')}
      />
    )
  } else if (screen === 'route' && selectedRoute) {
    content = (
      <BpRouteScreen
        lang={lang}
        route={selectedRoute}
        stationName={stationName}
        onSync={() => goSync(selectedRoute)}
        onBack={() => setScreen('map')}
      />
    )
  } else if (screen === 'qr' && selectedRoute) {
    content = (
      <BpQrScreen
        lang={lang}
        route={selectedRoute}
        destination={destination || getRouteDest(selectedRoute)}
        stationId={stationId}
        onBack={() => setScreen('route')}
        onDone={() => {
          track('qr-done')
          tryComplete(selectedRoute)
          goHome()
        }}
      />
    )
  } else if (screen === 'help') {
    content = <BpHelpScreen lang={lang} onBack={() => setScreen('mode')} />
  } else {
    screenClass = 'bp-screen bp-screen--scroll relative flex min-h-dvh flex-col'
    content = (
      <BusPassSignaturePage
        stationId={stationId}
        userId={userId}
        initialRouteId={selectedRoute?.id ?? TASK_ROUTE_ID}
        initialDestination={destination || undefined}
        onSyncRequest={(route) => {
          pickRoute(route, destination || TASK_DESTINATION)
          setScreen('route')
        }}
        onDestinationPick={(dest, route) => {
          setDestination(dest)
          if (route) setSelectedRoute(route)
          if (dest === TASK_DESTINATION) {
            const taskRoute = route ?? findTaskRoute(liveRoutes)
            if (taskRoute) tryComplete(taskRoute)
          }
        }}
      />
    )
  }

  return (
    <div className={screenClass}>
      {content}
      <BpInteractionMenu {...menuProps} />
    </div>
  )
}
