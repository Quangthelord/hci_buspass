import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useKiosk } from '../context/KioskContext'
import { useLiveBusRoutes } from '../data/busRoutes'
import { getDestination, getRoute } from '../data/mockData'
import { busRouteToMobile, destinationFromStop } from '../lib/busRouteAdapter'
import { parseTripQuery, tripQueryToSearchParams, type TripQuery } from '../lib/tripUrl'

/** Đồng bộ phiên chuyến từ query URL (sau quét QR trên điện thoại). */
export function useSyncTripFromUrl() {
  const [searchParams] = useSearchParams()
  const { lang, destination, selectedRouteId, setLang, setDestination, setSelectedRouteId } = useKiosk()
  const liveRoutes = useLiveBusRoutes()

  const query = useMemo(() => parseTripQuery(searchParams), [searchParams])

  const liveRoute = useMemo(
    () => liveRoutes.find((r) => r.id === (query?.r ?? selectedRouteId)),
    [liveRoutes, query?.r, selectedRouteId],
  )

  const route = useMemo(() => {
    if (liveRoute) return busRouteToMobile(liveRoute)
    return getRoute(query?.r ?? selectedRouteId ?? '01')
  }, [liveRoute, query?.r, selectedRouteId])

  const dest = useMemo(() => {
    if (query?.d) {
      const fromMock = getDestination(query.d)
      if (fromMock) return fromMock
      if (liveRoute) {
        const stop = liveRoute.stops.find((s) => s.id === query.d || s.name.toLowerCase().includes(query.d!))
        if (stop) return destinationFromStop(stop, liveRoute.id)
      }
    }
    if (liveRoute) {
      const last = liveRoute.stops[liveRoute.stops.length - 1]
      if (last) return destinationFromStop(last, liveRoute.id)
    }
    return destination
  }, [query?.d, liveRoute, destination])

  useEffect(() => {
    if (!query) return
    setSelectedRouteId(query.r)
    if (dest) setDestination(dest)
    if (query.lang) setLang(query.lang)
  }, [query, dest, setDestination, setLang, setSelectedRouteId])

  const tripQuery: TripQuery | null = query ?? (selectedRouteId
    ? {
        r: selectedRouteId,
        d: destination?.id ?? dest?.id,
        lang,
      }
    : null)

  const queryString = tripQuery ? tripQueryToSearchParams(tripQuery).toString() : ''

  return { query: tripQuery, route, dest, lang, queryString, liveRoute }
}
