import type { BusRouteData } from '../../data/busRoutes'
import { getRealtimeRoutes } from '../../lib/mockRealtime'

export interface RouteOption {
  id: string
  route: BusRouteData
  travelTimeMin: number
  stopCount: number
  nextDeparture: number
  label: string
  isRecommended: boolean
}

function findDestinationStop(route: BusRouteData, destination: string) {
  const q = destination.toLowerCase()
  return route.stops.find((s) => s.name.toLowerCase().includes(q))
}

function buildOption(route: BusRouteData, destination: string, recommended: boolean): RouteOption | null {
  const destStop = findDestinationStop(route, destination)
  if (!destStop) return null
  const origin = route.stops[0]
  const stopIndex = route.stops.indexOf(destStop)
  return {
    id: route.id,
    route,
    travelTimeMin: destStop.nextArrival + route.currentDelay,
    stopCount: stopIndex,
    nextDeparture: origin.nextArrival + route.currentDelay,
    label: `Tuyến ${route.id}`,
    isRecommended: recommended,
  }
}

/** Returns 2–3 route options; adds indirect alternatives when only one direct route exists. */
export function getRouteOptions(destination: string): RouteOption[] {
  const direct = getRealtimeRoutes()
    .map((r) => buildOption(r, destination, false))
    .filter((o): o is RouteOption => o !== null)
    .sort((a, b) => a.travelTimeMin - b.travelTimeMin)

  if (direct.length === 0) {
    const fallback = getRealtimeRoutes().find((r) => r.id === '01')!
    const destStop = fallback.stops[fallback.stops.length - 1]
    return [
      {
        id: fallback.id,
        route: fallback,
        travelTimeMin: destStop.nextArrival + fallback.currentDelay,
        stopCount: fallback.stops.length - 1,
        nextDeparture: fallback.stops[0].nextArrival + fallback.currentDelay,
        label: `Tuyến ${fallback.id}`,
        isRecommended: true,
      },
    ]
  }

  direct[0].isRecommended = true
  const options = [...direct]

  if (options.length < 3) {
    const used = new Set(options.map((o) => o.id))
    const extras = getRealtimeRoutes()
      .filter((r) => !used.has(r.id) && r.stops[0]?.name === 'Bến Thành')
      .slice(0, 3 - options.length)

    for (const r of extras) {
      const last = r.stops[r.stops.length - 1]
      options.push({
        id: `${r.id}-alt`,
        route: r,
        travelTimeMin: last.nextArrival + r.currentDelay + 12,
        stopCount: r.stops.length + 2,
        nextDeparture: r.stops[0].nextArrival + r.currentDelay + 5,
        label: `Tuyến ${r.id} (chuyển tuyến)`,
        isRecommended: false,
      })
    }
  }

  return options.slice(0, 3)
}

export interface JourneyStep {
  id: string
  verb: string
  text: string
  icon: 'walk' | 'bus' | 'ride' | 'arrive'
}

export function buildJourneySteps(
  option: RouteOption,
  destination: string,
  stationName: string,
): JourneyStep[] {
  const route = option.route
  const destStop =
    route.stops.find((s) => s.name.toLowerCase().includes(destination.toLowerCase())) ??
    route.stops[route.stops.length - 1]

  return [
    {
      id: 'walk',
      verb: 'Đi bộ',
      text: `Đi bộ 3 phút đến trạm ${stationName}`,
      icon: 'walk',
    },
    {
      id: 'board',
      verb: 'Lên',
      text: `Lên xe buýt số ${route.id} — hướng ${destStop.name}`,
      icon: 'bus',
    },
    {
      id: 'ride',
      verb: 'Đi',
      text: `Đi ${option.stopCount} trạm — xuống tại ${destStop.name}`,
      icon: 'ride',
    },
    {
      id: 'arrive',
      verb: 'Đến',
      text: `Đến ${destStop.name} — hoàn thành hành trình`,
      icon: 'arrive',
    },
  ]
}
