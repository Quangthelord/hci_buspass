import type { Lang } from '../data/mockData'
import { STATION } from '../data/mockData'

export interface TripQuery {
  r: string
  d?: string
  s?: string
  lang?: Lang
}

const LANGS: Lang[] = ['vi', 'en', 'zh', 'ko']

export function parseTripQuery(searchParams: URLSearchParams): TripQuery | null {
  const r = searchParams.get('r')
  if (!r) return null
  const rawLang = searchParams.get('lang')
  const lang = rawLang && LANGS.includes(rawLang as Lang) ? (rawLang as Lang) : undefined
  return {
    r,
    d: searchParams.get('d') ?? undefined,
    s: searchParams.get('s') ?? undefined,
    lang,
  }
}

export function tripQueryToSearchParams(q: TripQuery): URLSearchParams {
  const params = new URLSearchParams()
  params.set('r', q.r)
  if (q.d) params.set('d', q.d)
  if (q.s) params.set('s', q.s)
  if (q.lang) params.set('lang', q.lang)
  return params
}

export function buildTripUrl(
  query: TripQuery,
  options?: { origin?: string; path?: string },
): string {
  const origin =
    options?.origin ?? (typeof window !== 'undefined' ? window.location.origin : 'https://localhost:5173')
  const path = options?.path ?? '/m'
  const params = tripQueryToSearchParams({
    ...query,
    s: query.s ?? STATION.id,
  })
  return `${origin}${path}?${params.toString()}`
}

export function buildAppPath(query: TripQuery, subpath = ''): string {
  const base = subpath ? `/app/${subpath.replace(/^\//, '')}` : '/app'
  return `${base}?${tripQueryToSearchParams(query).toString()}`
}
