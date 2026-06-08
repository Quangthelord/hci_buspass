import type { BusRouteData } from '../../data/busRoutes'
import { getRealtimeRoutes } from '../../lib/mockRealtime'

export interface JourneyOption {
  id: string
  route: BusRouteData
  travelTimeMin: number
  stopCount: number
  nextDeparture: number
  walkBeforeM: number
  walkAfterM: number
  zones: number
  fare: string
  isRecommended: boolean
}

function findDestinationStop(route: BusRouteData, destination: string) {
  const q = destination.toLowerCase()
  return route.stops.find((s) => s.name.toLowerCase().includes(q))
}

function buildOption(route: BusRouteData, destination: string): JourneyOption | null {
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
    walkBeforeM: 64,
    walkAfterM: 38,
    zones: 1,
    fare: '7.000₫',
    isRecommended: false,
  }
}

export function getJourneyOptions(destination: string): JourneyOption[] {
  const direct = getRealtimeRoutes()
    .map((r) => buildOption(r, destination))
    .filter((o): o is JourneyOption => o !== null)
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
        walkBeforeM: 64,
        walkAfterM: 38,
        zones: 1,
        fare: '7.000₫',
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
        walkBeforeM: 120,
        walkAfterM: 80,
        zones: 2,
        fare: '12.000₫',
        isRecommended: false,
      })
    }
  }

  return options.slice(0, 3)
}

export function getDestination(route: BusRouteData, keyword: string): string {
  const q = keyword.toLowerCase()
  const stop = route.stops.find((s) => s.name.toLowerCase().includes(q))
  return stop?.name ?? route.stops[route.stops.length - 1].name
}
