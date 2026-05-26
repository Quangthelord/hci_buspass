import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useKiosk } from '../context/KioskContext'
import { getDestination, getRoute } from '../data/mockData'
import { parseTripQuery, tripQueryToSearchParams, type TripQuery } from '../lib/tripUrl'

/** Đồng bộ phiên chuyến từ query URL (sau quét QR trên điện thoại). */
export function useSyncTripFromUrl() {
  const [searchParams] = useSearchParams()
  const { lang, destination, selectedRouteId, setLang, setDestination, setSelectedRouteId } = useKiosk()

  const query = useMemo(() => parseTripQuery(searchParams), [searchParams])

  useEffect(() => {
    if (!query) return
    setSelectedRouteId(query.r)
    if (query.d) {
      const dest = getDestination(query.d)
      if (dest) setDestination(dest)
    }
    if (query.lang) setLang(query.lang)
  }, [query, setDestination, setLang, setSelectedRouteId])

  const route = getRoute(query?.r ?? selectedRouteId ?? '19')
  const dest = (query?.d ? getDestination(query.d) : null) ?? destination

  const tripQuery: TripQuery | null = query ?? (selectedRouteId
    ? {
        r: selectedRouteId,
        d: destination?.id,
        lang,
      }
    : null)

  const queryString = tripQuery ? tripQueryToSearchParams(tripQuery).toString() : ''

  return { query: tripQuery, route, dest, lang, queryString }
}
