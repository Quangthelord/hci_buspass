import { useMemo, useRef, useState, type ReactNode } from 'react'
import { busRoutesData } from '../../data/busRoutes'
import { completeTask, logClick, startTask } from '../../lib/telemetry'
import { matchesTaskDestination, TASK_DESTINATION } from '../../lib/taskGoal'
import { useMobileScroll } from '../../hooks/useMobileScroll'
import type { TpScreen, TpTab } from './constants'
import { VARIANT_ID } from './constants'
import { getJourneyOptions, type JourneyOption } from './journeyOptions'
import {
  TpJourneyScreen,
  TpLiveBusScreen,
  TpPlacesScreen,
  TpPlannerScreen,
  TpStopsNearMeScreen,
} from './TpScreens'
import './tpTransperth.css'

export interface Variant3Props {
  stationId?: string
  userId?: string
}

function getStationName(stationId: string): string {
  if (busRoutesData.station.id === stationId) return busRoutesData.station.name
  return busRoutesData.station.name
}

export default function Variant3WarmWayfinding({
  stationId = 'ben-thanh',
  userId = 'participant-01',
}: Variant3Props) {
  useMobileScroll()

  const [screen, setScreen] = useState<TpScreen>('places')
  const [tab, setTab] = useState<TpTab>('places')
  const [origin, setOrigin] = useState('Bến Thành Stn')
  const [destination, setDestination] = useState('')
  const [selectedOption, setSelectedOption] = useState<JourneyOption | null>(null)
  const taskStarted = useRef(false)

  const stationName = getStationName(stationId)

  const journeyOptions = useMemo(
    () => (destination.trim() ? getJourneyOptions(destination.trim()) : []),
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

  const tryComplete = (route: JourneyOption['route']) => {
    if (matchesTaskDestination(route)) {
      completeTask(VARIANT_ID, true)
    }
  }

  const navigateTab = (t: TpTab) => {
    setTab(t)
    trackClick(`tab-${t}`, true)
    if (t === 'places') setScreen('places')
    else if (t === 'journeys') setScreen('planner')
    else setScreen('stopsNearMe')
  }

  const openPlanner = (dest?: string) => {
    ensureTaskStart()
    if (dest) setDestination(dest)
    setScreen('planner')
    setTab('journeys')
    trackClick('open-planner', true)
  }

  const selectJourney = (opt: JourneyOption, source: string) => {
    ensureTaskStart()
    trackClick(source, true)
    setSelectedOption(opt)
    setScreen('journey')
    tryComplete(opt.route)
  }

  const shell = (child: ReactNode) => (
    <div className="tp-root flex min-h-dvh flex-col bg-white">{child}</div>
  )

  if (screen === 'liveBus' && selectedOption) {
    return shell(
      <TpLiveBusScreen
        route={selectedOption.route}
        onBack={() => setScreen('journey')}
      />,
    )
  }

  if (screen === 'journey' && selectedOption) {
    return shell(
      <TpJourneyScreen
        option={selectedOption}
        destination={destination || TASK_DESTINATION}
        stationName={stationName}
        onBack={() => setScreen('planner')}
        onLiveBus={() => {
          trackClick('live-bus', true)
          setScreen('liveBus')
        }}
        onStopClick={(id) => trackClick(`stop-${id}`, true)}
      />,
    )
  }

  if (screen === 'planner') {
    return shell(
      <TpPlannerScreen
        origin={origin}
        destination={destination}
        options={journeyOptions}
        onBack={() => {
          setScreen(tab === 'routes' ? 'stopsNearMe' : 'places')
        }}
        onSwap={() => {
          trackClick('swap-locations', true)
          const prev = origin
          setOrigin(destination || stationName)
          setDestination(prev.includes('Stn') ? '' : prev)
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
        onSelectOption={(opt) => selectJourney(opt, `journey-${opt.route.id}`)}
        onSearchFocus={() => ensureTaskStart()}
        onTab={navigateTab}
      />,
    )
  }

  if (screen === 'stopsNearMe') {
    return shell(
      <TpStopsNearMeScreen
        stationName={stationName}
        onStopTap={() => openPlanner(TASK_DESTINATION)}
        onTab={navigateTab}
      />,
    )
  }

  return shell(
    <TpPlacesScreen
      onAddPlace={() => openPlanner()}
      onPlaceTap={(_name, address) => {
        const dest = address.includes('Suối Tiên') ? TASK_DESTINATION : address
        openPlanner(dest)
      }}
      onTab={navigateTab}
    />,
  )
}
