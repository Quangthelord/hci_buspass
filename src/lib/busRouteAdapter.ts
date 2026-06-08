import type { BusRoute, Destination } from '../data/mockData'
import type { BusRouteData, BusStop } from '../data/busRoutes'

/** Chuyển tuyến realtime (busRoutes.json) sang định dạng mobile TripDetail. */
export function busRouteToMobile(route: BusRouteData): BusRoute {
  const first = route.stops[0]
  const last = route.stops[route.stops.length - 1]
  const eta = (first?.nextArrival ?? 5) + route.currentDelay

  return {
    id: route.id,
    number: route.id,
    nameVi: route.name,
    nameEn: route.name,
    type: 'regular',
    from: first?.name ?? 'Bến Thành',
    to: last?.name ?? '—',
    via: route.stops.slice(1, -1).map((s) => s.name),
    etaMinutes: eta,
    etaRange: `${Math.max(1, eta - 1)}-${eta + 4}`,
    traffic: route.currentDelay > 3 ? 'congested' : 'normal',
    firstTrip: '05:00',
    lastTrip: '22:00',
    interval: '10-15 phút',
    fare: 7000,
    fareStudent: 3500,
    vehicles: [
      {
        id: 1,
        distanceKm: 0.6,
        etaMinutes: eta,
        status: 'near',
      },
    ],
    alert: route.delayReason ?? undefined,
    stops: route.stops.map((s, i) => ({
      id: i + 1,
      name: s.name,
      isCurrent: i === 0,
      isTerminal: i === route.stops.length - 1,
    })),
  }
}

export function destinationFromStop(stop: BusStop, routeId: string): Destination {
  return {
    id: stop.id,
    nameVi: stop.name,
    nameEn: stop.name,
    icon: stop.name.toLowerCase().includes('suối') ? '🎢' : '📍',
    distanceKm: 0,
    lat: stop.lat,
    lng: stop.lng,
    routes: [routeId],
  }
}
