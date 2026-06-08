import type { BusRouteData } from '../../data/busRoutes'

export type BusStatus = 'onTime' | 'delayed' | 'unknown'

export function getBusStatus(route: BusRouteData): BusStatus {
  if (route.id === '08') return 'unknown'
  if (route.currentDelay > 0) return 'delayed'
  return 'onTime'
}

export function getArrivalMinutes(route: BusRouteData): number | null {
  if (route.id === '08') return null
  return route.stops[0].nextArrival + route.currentDelay
}

export function getDestination(route: BusRouteData): string {
  return route.stops[route.stops.length - 1]?.name ?? '—'
}
