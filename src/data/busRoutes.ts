import { useSyncExternalStore } from 'react'
import { getRealtimeSnapshot, subscribeRealtime } from '../lib/mockRealtime'
import raw from './busRoutes.json'

export interface BusStop {
  id: string
  name: string
  lat: number
  lng: number
  nextArrival: number
  nextNextArrival: number
}

export interface BusRouteData {
  id: string
  name: string
  color: string
  stops: BusStop[]
  currentDelay: number
  delayReason: string | null
}

export interface BusRoutesFile {
  station: { id: string; name: string; lat: number; lng: number }
  routes: BusRouteData[]
}

export const busRoutesData = raw as BusRoutesFile

export function getBusRoute(id: string): BusRouteData | undefined {
  return busRoutesData.routes.find((r) => r.id === id)
}

export function getStationById(id: string) {
  return busRoutesData.station.id === id ? busRoutesData.station : busRoutesData.station
}

export function findRoutesToDestination(keyword: string): BusRouteData[] {
  const q = keyword.toLowerCase()
  return busRoutesData.routes.filter((r) =>
    r.stops.some((s) => s.name.toLowerCase().includes(q)),
  )
}

/** Live routes from mock realtime simulator (falls back to static JSON). */
export function useLiveBusRoutes(): BusRouteData[] {
  return useSyncExternalStore(
    subscribeRealtime,
    () => getRealtimeSnapshot().routes,
    () => busRoutesData.routes,
  )
}

export function useLiveStation() {
  return useSyncExternalStore(
    subscribeRealtime,
    () => getRealtimeSnapshot().station,
    () => busRoutesData.station,
  )
}
