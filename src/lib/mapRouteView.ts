import type { BusRouteData } from '../data/busRoutes'

export type MapFocusMode = 'default' | 'tracking' | 'micro' | 'delayed'

export function getArrivalMinutes(route: BusRouteData): number {
  return route.stops[0].nextArrival + route.currentDelay
}

/** 0 = xa trạm, 1 = sát trạm (Bến Thành) */
export function busProgressFromRoute(route: BusRouteData): number {
  const mins = getArrivalMinutes(route)
  return Math.max(0.06, Math.min(0.94, 1 - mins / 16))
}

export function lerpAlongLine(points: [number, number][], t: number): [number, number] {
  if (points.length === 0) return [10.772, 106.698]
  if (points.length === 1) return points[0]
  const seg = Math.min(Math.floor(t * (points.length - 1)), points.length - 2)
  const local = t * (points.length - 1) - seg
  const a = points[seg]
  const b = points[seg + 1]
  return [a[0] + (b[0] - a[0]) * local, a[1] + (b[1] - a[1]) * local]
}

export function getMapFocusMode(route: BusRouteData): MapFocusMode {
  if (route.id === '01') return 'tracking'
  const mins = getArrivalMinutes(route)
  if (route.currentDelay === 0 && mins <= 5) return 'micro'
  if (route.currentDelay > 0) return 'delayed'
  return 'tracking'
}

export function routePositions(route: BusRouteData): [number, number][] {
  return route.stops.map((s) => [s.lat, s.lng] as [number, number])
}

/** Đoạn từ trạm (điểm 0) đến vị trí xe */
export function getApproachSegments(route: BusRouteData): {
  busPos: [number, number]
  stationToBus: [number, number][]
  trafficAhead: [number, number][]
} {
  const positions = routePositions(route)
  const t = busProgressFromRoute(route)
  const busPos = lerpAlongLine(positions, t)
  const stopIdx = Math.max(1, Math.ceil(t * (positions.length - 1)))
  const stationToBus: [number, number][] = [...positions.slice(0, stopIdx + 1)]
  const last = stationToBus[stationToBus.length - 1]
  if (last[0] !== busPos[0] || last[1] !== busPos[1]) {
    stationToBus.push(busPos)
  }

  const split = Math.max(2, Math.ceil(stationToBus.length * 0.45))
  const trafficAhead = stationToBus.slice(-split)

  return { busPos, stationToBus, trafficAhead }
}

export function busTooltipLabel(route: BusRouteData, lang: 'vi' | 'en'): string {
  const mins = getArrivalMinutes(route)
  const delay = route.currentDelay
  if (lang === 'vi') {
    if (delay > 0) return `Cách ${mins} phút (Trễ ${delay}′)`
    return `Cách ${mins} phút`
  }
  if (delay > 0) return `${mins} min away (${delay}′ late)`
  return `${mins} min away`
}

export function delayedBusPopup(route: BusRouteData, lang: 'vi' | 'en'): string {
  if (lang === 'vi') {
    return route.delayReason
      ? `Đang di chuyển chậm — ${route.delayReason}`
      : 'Đang di chuyển chậm do mật độ giao thông cao'
  }
  return route.delayReason
    ? `Moving slowly — ${route.delayReason}`
    : 'Moving slowly due to heavy traffic'
}
