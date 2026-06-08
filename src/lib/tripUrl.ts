import type { Lang } from '../data/mockData'
import { STATION } from '../data/mockData'

export interface TripQuery {
  r: string
  d?: string
  s?: string
  lang?: Lang
}

const LANGS: Lang[] = ['vi', 'en', 'zh', 'ko']
const QR_ORIGIN_KEY = 'buspass-qr-origin'

/** Ánh xạ tên điểm đến HCI → id query `d`. */
const DESTINATION_IDS: Record<string, string> = {
  'suoi-tien': 'suoi-tien',
  'suối tiên': 'suoi-tien',
  'ben-thanh': 'ben-thanh',
  'bến thành': 'ben-thanh',
}

export function destinationIdFromName(name: string): string | undefined {
  const key = name.trim().toLowerCase()
  return DESTINATION_IDS[key] ?? (key ? key.replace(/\s+/g, '-') : undefined)
}

export function getStoredQrOrigin(): string | null {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem(QR_ORIGIN_KEY)
}

export function setStoredQrOrigin(origin: string) {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(QR_ORIGIN_KEY, origin.replace(/\/$/, ''))
}

/** Origin để điện thoại quét QR mở được (ưu tiên LAN IP, không dùng localhost). */
export function getScannableOrigin(): string {
  const env = import.meta.env.VITE_QR_ORIGIN as string | undefined
  if (env?.trim()) return env.trim().replace(/\/$/, '')

  if (typeof window !== 'undefined') {
    const stored = getStoredQrOrigin()
    if (stored) return stored

    const { protocol, hostname, port } = window.location
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `${protocol}//${hostname}${port ? `:${port}` : ''}`
    }
  }

  return typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'
}

export function isLocalOnlyOrigin(origin = getScannableOrigin()): boolean {
  return /localhost|127\.0\.0\.1/.test(origin)
}

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
  const origin = (options?.origin ?? getScannableOrigin()).replace(/\/$/, '')
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
