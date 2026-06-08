import type { BusRouteData } from '../../data/busRoutes'
import type { RouteOption } from './routeOptions'

export function formatClock(minutesFromNow: number): string {
  const d = new Date()
  d.setMinutes(d.getMinutes() + minutesFromNow)
  const h = d.getHours().toString().padStart(2, '0')
  const m = d.getMinutes().toString().padStart(2, '0')
  return `${h}:${m}`
}

export function formatTimeRange(startMin: number, totalMin: number): string {
  return `${formatClock(startMin)} - ${formatClock(startMin + totalMin)}`
}

export function formatArrivalLabel(minutes: number): string {
  if (minutes > 120) return `Ngày mai ${formatClock(minutes - 60)}`
  return formatClock(minutes)
}

export function getDestination(route: BusRouteData, keyword: string): string {
  const q = keyword.toLowerCase()
  const stop = route.stops.find((s) => s.name.toLowerCase().includes(q))
  return stop?.name ?? route.stops[route.stops.length - 1].name
}

export function getWalkMinutes(): number {
  return 3
}

export function getRouteLineColor(routeId: string): 'blue' | 'green' {
  return routeId === '01' ? 'green' : 'blue'
}

export function buildRouteTimeline(option: RouteOption, destination: string) {
  const walk = getWalkMinutes()
  const dest = getDestination(option.route, destination)
  return {
    walkBefore: walk,
    routeId: option.route.id,
    walkAfter: 2,
    dest,
    totalMin: option.travelTimeMin + walk + 2,
    departMin: option.nextDeparture,
  }
}
