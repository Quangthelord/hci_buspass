import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import {
  Bell,
  Bus,
  ChevronRight,
  Clock,
  HelpCircle,
  List,
  Map,
  MapPin,
  Search,
  Smartphone,
  Ticket,
  AlertTriangle,
} from 'lucide-react'
import type { BusRouteData } from '../../data/busRoutes'
import { formatTime24 } from '../../lib/formatVi'
import { QrOriginSetup } from '../../components/mobile/QrOriginSetup'
import { RouteStopTimeline } from '../../components/d6/RouteStopTimeline'
import { RouteQrInline } from '../../components/d6/RouteQrInline'
import { buildTripUrl, destinationIdFromName } from '../../lib/tripUrl'
import { HELP_CATEGORIES, HELP_CONTENT, HELP_TITLES, tr } from '../../i18n/translations'
import type { BpLang } from './constants'
import { BpKioskHeader } from './BpKioskHeader'

const LANG_OPTIONS: { code: BpLang; label: string; sub: string; flag: string }[] = [
  { code: 'vi', label: 'Tiếng Việt', sub: 'VI', flag: '🇻🇳' },
  { code: 'en', label: 'English', sub: 'EN', flag: '🇬🇧' },
]

export function BpHomeScreen({
  lang,
  stationName,
  routeIds,
  onLang,
  onHelp,
}: {
  lang: BpLang
  stationName: string
  routeIds: string[]
  onLang: (l: BpLang) => void
  onHelp: () => void
}) {
  const [now, setNow] = useState(new Date())
  const isVi = lang === 'vi'

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const routeCount = routeIds.length

  return (
    <div className="bp-welcome bp-flow welcome-animate flex min-h-full flex-col">
      <header className="bp-welcome-header flex shrink-0 items-center justify-end border-b border-kiosk-border/60 px-3 py-2">
        <time
          className="text-xl font-bold tabular-nums text-gray-900"
          dateTime={now.toISOString()}
        >
          {formatTime24(now)}
        </time>
      </header>

      <section className="bp-welcome-identity shrink-0 px-3 py-3 text-center">
        <p className="flex items-center justify-center gap-1 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
          <MapPin className="h-3.5 w-3.5 text-neon-green" strokeWidth={2.5} />
          {isVi ? 'Trạm' : 'Station'}
        </p>
        <h1 className="bp-welcome-station mt-1 font-black uppercase leading-tight text-gray-900">
          {stationName}
        </h1>
        <p className="mt-2 text-sm font-medium text-green-800">
          {isVi
            ? 'Chào mừng bạn đến với hệ thống xe buýt thông minh'
            : 'Welcome to the smart bus system'}
        </p>

        {routeCount > 0 && (
          <>
            <p className="mt-4 text-sm font-semibold text-gray-700">
              {isVi
                ? `Hiện có ${routeCount} tuyến đang hoạt động tại đây`
                : `${routeCount} routes active at this stop`}
            </p>
            <div className="bp-welcome-routes mt-3 flex flex-wrap justify-center gap-2">
              {routeIds.map((id) => (
                <span
                  key={id}
                  className="inline-flex min-h-10 min-w-[3rem] items-center justify-center rounded-lg border-2 border-neon-green/50 bg-white px-3 text-base font-black text-neon-green shadow-sm"
                >
                  {id}
                </span>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="bp-welcome-lang flex flex-1 flex-col justify-center px-4 py-4">
        <div className="mb-4 text-center">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-800">
            {isVi ? 'Vui lòng chọn ngôn ngữ' : 'Please select language'}
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            {isVi ? 'Please select language' : 'Vui lòng chọn ngôn ngữ'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {LANG_OPTIONS.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => onLang(l.code)}
              className="bp-welcome-lang-btn btn-kiosk group flex min-h-[3.75rem] flex-col items-center justify-center gap-0.5 rounded-xl border-2 border-neon-green bg-white px-2 py-3 shadow-sm transition hover:border-neon-green hover:bg-neon-green hover:text-white active:scale-[0.98]"
            >
              <span className="text-2xl leading-none" aria-hidden>
                {l.flag}
              </span>
              <span className="text-sm font-bold leading-tight">{l.label}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 group-hover:text-white/80">
                {l.sub}
              </span>
            </button>
          ))}
        </div>
      </section>

      <footer className="bp-welcome-footer kiosk-scroll-pad shrink-0 px-4 pb-4 pt-2">
        <button
          type="button"
          onClick={onHelp}
          className="bp-welcome-help-btn btn-kiosk flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-xl border-2 border-kiosk-border bg-kiosk-panel text-sm font-bold text-gray-800 transition hover:border-neon-green hover:bg-white"
        >
          <HelpCircle className="h-5 w-5 text-neon-green" strokeWidth={2.5} />
          {isVi ? 'Trợ giúp / Help' : 'Help / Trợ giúp'}
        </button>
      </footer>
    </div>
  )
}

export function BpModeScreen({
  lang,
  onMap,
  onList,
  onTrip,
  onBack,
}: {
  lang: BpLang
  onMap: () => void
  onList: () => void
  onTrip: () => void
  onBack: () => void
}) {
  const isVi = lang === 'vi'

  return (
    <div className="bp-mode bp-flow kiosk-scroll-pad flex min-h-full flex-col px-4 py-4">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 self-start text-sm font-semibold text-neon-green"
      >
        ← {isVi ? 'Quay lại' : 'Back'}
      </button>

      <header className="mb-5 text-center">
        <h1 className="text-lg font-bold uppercase tracking-wide text-gray-900">
          {isVi ? 'Bạn muốn tra cứu gì?' : 'What do you want to find?'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isVi ? 'What do you want to find?' : 'Bạn muốn tra cứu gì?'}
        </p>
      </header>

      <button
        type="button"
        onClick={onTrip}
        className="bp-mode-card group mb-5 flex min-h-[4.5rem] w-full items-center gap-4 rounded-2xl border-2 border-neon-green bg-white px-4 py-4 text-left shadow-sm transition active:scale-[0.98] hover:border-neon-green hover:bg-green-50"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neon-green/10 text-neon-green">
          <Search className="h-6 w-6" strokeWidth={2.5} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-bold text-gray-900">
            {isVi ? 'Tìm đường đi (A → B)' : 'Find a route (A → B)'}
          </span>
          <span className="mt-0.5 block text-sm text-gray-600">
            {isVi
              ? 'Tìm lộ trình nhanh nhất đến điểm bạn cần'
              : 'Fastest route to your destination'}
          </span>
        </span>
      </button>

      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
        {isVi ? 'Xem các tuyến tại trạm này' : 'Routes at this stop'}
      </p>

      <div className="grid grid-cols-2 gap-3">
        <ModeTouchCard
          lang={lang}
          icon={<Map className="h-8 w-8" strokeWidth={2} />}
          titleVi="Bản đồ trực quan"
          titleEn="Visual map"
          subVi="Map Mode"
          subEn="Map Mode"
          onSelect={onMap}
        />
        <ModeTouchCard
          lang={lang}
          icon={<List className="h-8 w-8" strokeWidth={2} />}
          titleVi="Danh sách tuyến"
          titleEn="Route list"
          subVi="Chữ phóng to"
          subEn="Large text"
          onSelect={onList}
        />
      </div>

      <p className="bp-mode-tip mt-auto pt-5 text-center text-xs text-gray-500">
        💡 {tr('modeTip', lang)}
      </p>
    </div>
  )
}

function ModeTouchCard({
  lang,
  icon,
  titleVi,
  titleEn,
  subVi,
  subEn,
  onSelect,
}: {
  lang: BpLang
  icon: ReactNode
  titleVi: string
  titleEn: string
  subVi: string
  subEn: string
  onSelect: () => void
}) {
  const isVi = lang === 'vi'
  const title = isVi ? titleVi : titleEn
  const sub = isVi ? subVi : subEn
  const subAlt = isVi ? titleEn : titleVi

  return (
    <button
      type="button"
      onClick={onSelect}
      className="bp-mode-card flex min-h-[7.5rem] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-kiosk-border bg-white px-3 py-4 text-center shadow-sm transition active:scale-[0.98] hover:border-neon-green hover:bg-green-50"
    >
      <span className="text-neon-green">{icon}</span>
      <span className="block text-sm font-bold leading-tight text-gray-900">{title}</span>
      <span className="block text-[11px] font-medium text-gray-500">{subAlt}</span>
      <span className="block text-[10px] text-gray-400">{sub}</span>
    </button>
  )
}

export function BpListPanel({
  lang,
  routes,
  onRoute,
}: {
  lang: BpLang
  routes: BusRouteData[]
  onRoute: (r: BusRouteData) => void
}) {
  const [query, setQuery] = useState('')
  const isVi = lang === 'vi'

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    const list = q
      ? routes.filter(
          (r) =>
            r.id.includes(q) ||
            r.name.toLowerCase().includes(q) ||
            r.stops.some((s) => s.name.toLowerCase().includes(q)),
        )
      : routes
    return [...list].sort(
      (a, b) =>
        a.stops[0].nextArrival + a.currentDelay - (b.stops[0].nextArrival + b.currentDelay),
    )
  }, [routes, query])

  return (
    <div className="bp-list bp-flow kiosk-scroll-pad flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-2">
      <label className="bp-list-search relative mb-2 block">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neon-green"
          strokeWidth={2}
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tr('searchPlaceholder', lang)}
          className="w-full rounded-xl border-2 border-neon-green/40 bg-white py-3.5 pl-11 pr-3 text-base font-semibold shadow-sm outline-none focus:border-neon-green"
        />
      </label>

      <header className="mb-2">
        <h1 className="text-xs font-bold uppercase tracking-wide text-gray-800">
          {isVi ? 'Danh sách tuyến tại trạm này' : 'Routes at this stop'}
        </h1>
        <p className="mt-0.5 text-xs text-gray-500">[{tr('easyRead', lang)}]</p>
      </header>

      <div className="flex flex-col gap-3 pb-4">
        {filtered.map((r) => (
          <ListRouteRow key={r.id} lang={lang} route={r} onSelect={() => onRoute(r)} />
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500">
            {isVi ? 'Không tìm thấy tuyến phù hợp' : 'No matching routes'}
          </p>
        )}
      </div>
    </div>
  )
}

/** @deprecated Use BpDashboard list view — kept for standalone routes if needed */
export function BpListScreen({
  lang,
  routes,
  onRoute,
  onBack,
  stationName,
}: {
  lang: BpLang
  routes: BusRouteData[]
  onRoute: (r: BusRouteData) => void
  onBack: () => void
  stationName: string
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <BpKioskHeader lang={lang} stationName={stationName} onBack={onBack} />
      <BpListPanel lang={lang} routes={routes} onRoute={onRoute} />
    </div>
  )
}

function ListRouteRow({
  lang,
  route,
  onSelect,
}: {
  lang: BpLang
  route: BusRouteData
  onSelect: () => void
}) {
  const isVi = lang === 'vi'
  const origin = route.stops[0]?.name ?? ''
  const dest = route.stops[route.stops.length - 1]?.name ?? ''
  const wait = route.stops[0].nextArrival + route.currentDelay
  const waitMax = wait + 5
  const hasDelay = route.currentDelay > 0
  const severe =
    route.currentDelay >= 5 ||
    Boolean(route.delayReason?.toLowerCase().includes('kẹt'))

  const etaClass = !hasDelay
    ? 'text-neon-green'
    : severe
      ? 'text-red-600'
      : 'text-amber-600'

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`bp-list-row group w-full border-2 bg-white text-left shadow-sm transition active:scale-[0.99] hover:border-neon-green hover:bg-green-50/40 ${
        severe ? 'border-amber-300' : 'border-kiosk-border'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span className="bp-list-route-badge flex shrink-0 items-center justify-center bg-neon-green font-black text-white">
          {route.id}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-gray-900">
            {origin} → {dest}
          </p>
          {route.delayReason && (
            <p
              className={`mt-1 flex items-start gap-1 text-xs font-semibold ${severe ? 'text-red-600' : 'text-amber-700'}`}
            >
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
              {route.delayReason}
            </p>
          )}
          <p className="mt-1 flex items-center gap-1 text-[10px] text-gray-500 group-hover:text-neon-green">
            <ChevronRight className="h-3 w-3" strokeWidth={2.5} />
            {isVi ? 'Chạm để xem lộ trình' : 'Tap to view route'}
          </p>
        </div>
        <div className={`shrink-0 text-right ${etaClass}`}>
          <p className="text-xl font-black tabular-nums leading-none">
            {wait}–{waitMax}′
          </p>
          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide opacity-80">
            {isVi ? 'phút' : 'min'}
          </p>
        </div>
      </div>
    </button>
  )
}

export function BpRouteScreen({
  lang,
  route,
  stationName,
  stationId,
  onComplete,
  onBack,
}: {
  lang: BpLang
  route: BusRouteData
  stationName: string
  stationId: string
  onComplete?: () => void
  onBack: () => void
}) {
  const isVi = lang === 'vi'
  const origin = route.stops[0]?.name ?? ''
  const dest = route.stops[route.stops.length - 1]?.name ?? ''
  const wait = route.stops[0].nextArrival + route.currentDelay
  const hasDelay = route.currentDelay > 0
  const severe =
    route.currentDelay >= 5 ||
    Boolean(route.delayReason?.toLowerCase().includes('kẹt'))
  const etaClass = !hasDelay ? 'text-neon-green' : severe ? 'text-red-600' : 'text-amber-600'

  return (
    <div className="bp-route flex min-h-0 flex-1 flex-col">
      <BpKioskHeader lang={lang} stationName={stationName} onBack={onBack} />

      <div className="bp-route-main flex min-h-0 w-full flex-1 flex-col box-border">
        {/* ── Top 2/3: thông tin + timeline ── */}
        <section className="bp-route-top top-info-section flex min-h-0 w-full flex-[2] flex-col overflow-hidden box-border">
          <div className="bp-route-top-scroll flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto p-6">
            <header className="bp-route-banner mb-4 shrink-0 rounded-lg bg-green-50/80 px-4 py-3">
              <span className="inline-flex items-center gap-1 rounded-md bg-neon-green px-2.5 py-1 text-xs font-black text-white">
                <Bus className="h-3.5 w-3.5" strokeWidth={2.5} />
                {isVi ? 'TUYẾN' : 'ROUTE'} {route.id}
              </span>
              <p className="mt-2 text-sm font-bold leading-snug text-gray-900">
                {origin} → {dest}
              </p>
            </header>

            <div className="bp-route-split flex min-h-0 flex-1 flex-col gap-6 min-[640px]:flex-row min-[640px]:items-start">
              <div className="bp-route-info flex w-full min-w-0 flex-col gap-6 min-[640px]:w-[45%] min-[640px]:max-w-[45%] min-[640px]:shrink-0">
                <section className="bp-route-panel w-full">
                  <h2 className="bp-route-panel__title flex items-center gap-1.5 font-bold uppercase tracking-wide text-gray-600">
                    <Clock className="h-4 w-4 shrink-0 text-neon-green" strokeWidth={2.5} />
                    {isVi ? 'Xe sắp đến' : 'Next arrival'}
                  </h2>
                  <p className={`bp-route-eta mt-2 font-black tabular-nums leading-none ${etaClass}`}>
                    {wait} {isVi ? 'phút' : 'min'}
                  </p>
                  {route.delayReason && (
                    <p
                      className={`mt-2 flex w-full items-start gap-1.5 break-words text-sm font-semibold leading-snug ${severe ? 'text-red-700' : 'text-amber-800'}`}
                    >
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.5} />
                      <span className="min-w-0 flex-1 break-words">{route.delayReason}</span>
                    </p>
                  )}
                </section>

                <section className="bp-route-panel w-full">
                  <h2 className="bp-route-panel__title flex items-center gap-1.5 font-bold uppercase tracking-wide text-gray-600">
                    <Ticket className="h-4 w-4 shrink-0 text-neon-green" strokeWidth={2.5} />
                    {isVi ? 'Giá vé' : 'Fare'}
                  </h2>
                  <div className="mt-2 flex w-full flex-col gap-2">
                    <span className="bp-fare-badge block w-full break-words rounded-lg bg-[#f0f0f0] px-4 py-3 text-sm text-gray-800">
                      {isVi ? 'Vé thường' : 'Standard'}:{' '}
                      <strong className="text-base text-gray-900">7.000₫</strong>
                    </span>
                    <span className="bp-fare-badge block w-full break-words rounded-lg bg-[#f0f0f0] px-4 py-3 text-sm text-gray-800">
                      {isVi ? 'Học sinh / SV' : 'Student'}:{' '}
                      <strong className="text-base text-gray-900">3.500₫</strong>
                    </span>
                  </div>
                </section>
              </div>

              <div className="bp-route-stops w-full min-w-0 min-[640px]:w-[55%] min-[640px]:max-w-[55%] min-[640px]:flex-1 min-[640px]:border-l min-[640px]:border-[#e8e8e8] min-[640px]:pl-6">
                <h2 className="bp-route-panel__title mb-4 font-bold uppercase tracking-wide text-gray-600">
                  {isVi ? 'Lộ trình chi tiết' : 'Route'}
                </h2>
                <RouteStopTimeline stops={route.stops} stationName={stationName} lang={lang} />
              </div>
            </div>
          </div>
        </section>

        {/* ── Bottom 1/3: vùng QR full-width ── */}
        <section className="bp-route-bottom bottom-qr-section flex min-h-0 w-full flex-1 shrink-0 flex-col justify-center border-t border-[#e0e0e0] bg-[#f9f9f9] box-border p-6">
          <RouteQrInline
            route={route}
            destination={dest}
            stationId={stationId}
            lang={lang}
            layout="dock"
          />
          {onComplete && (
            <button
              type="button"
              onClick={onComplete}
              className="bp-route-done-btn mt-4 w-full shrink-0 rounded-xl border-2 border-kiosk-border bg-white py-3 text-sm font-semibold text-gray-700 transition hover:border-neon-green hover:text-neon-green"
            >
              {isVi ? 'Hoàn tất' : 'Done'}
            </button>
          )}
        </section>
      </div>
    </div>
  )
}

export function BpQrScreen({
  lang,
  route,
  destination,
  stationId,
  stationName,
  onDone,
  onBack,
}: {
  lang: BpLang
  route: BusRouteData
  destination: string
  stationId: string
  stationName: string
  onDone: () => void
  onBack: () => void
}) {
  const isVi = lang === 'vi'
  const AUTO_HOME_SEC = 15
  const [countdown, setCountdown] = useState(AUTO_HOME_SEC)
  const [originVersion, setOriginVersion] = useState(0)
  const finishedRef = useRef(false)

  const finish = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    onDone()
  }, [onDone])

  useEffect(() => {
    const t = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (countdown === 0) finish()
  }, [countdown, finish])

  const tripQuery = useMemo(
    () => ({
      r: route.id,
      d: destinationIdFromName(destination),
      s: stationId,
      lang,
    }),
    [route.id, destination, stationId, lang],
  )
  const tripUrl = useMemo(() => buildTripUrl(tripQuery), [tripQuery, originVersion])

  return (
    <div className="bp-qr-screen flex min-h-0 flex-1 flex-col">
      <BpKioskHeader lang={lang} stationName={stationName} onBack={onBack} />
      <div className="bp-flow kiosk-scroll-pad flex flex-col items-center px-4 py-3">
      <header className="mb-6 w-full max-w-md text-center">
        <h1 className="flex items-center justify-center gap-2 text-base font-black uppercase tracking-wide text-neon-green">
          <Smartphone className="h-5 w-5" strokeWidth={2.5} />
          {isVi ? 'Đồng bộ lộ trình thành công' : 'Route ready to sync'}
        </h1>
        {countdown > 0 && (
          <p className="mt-2 text-sm font-semibold text-amber-600">
            {isVi
              ? `Tự động về trang chủ sau ${countdown} giây…`
              : `Returning home in ${countdown}s…`}
          </p>
        )}
      </header>

      <QrOriginSetup lang={lang} sampleQuery={tripQuery} onSaved={() => setOriginVersion((v) => v + 1)} />

      <div className="mb-4 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-neon-green px-3 py-1 text-sm font-black text-white">
          <Bus className="h-4 w-4" strokeWidth={2.5} />
          {isVi ? 'TUYẾN' : 'ROUTE'} {route.id}
        </span>
        <p className="mt-2 text-lg font-bold text-gray-900">{destination}</p>
      </div>

      <div className="bp-qr-hero mb-5 rounded-2xl bg-white p-6 shadow-md">
        <QRCodeSVG
          value={tripUrl}
          size={280}
          level="H"
          includeMargin={false}
          className="bp-qr-code mx-auto h-auto w-full max-w-[280px]"
        />
      </div>

      <p className="mb-5 flex max-w-sm items-center justify-center gap-2 text-center text-base font-bold text-gray-800">
        <Smartphone className="h-5 w-5 shrink-0 text-neon-green" strokeWidth={2.5} />
        {isVi ? 'Mở Camera trên điện thoại để quét' : 'Open your camera to scan'}
      </p>

      <p className="mb-6 max-w-sm text-center text-sm leading-relaxed text-gray-600">
        {isVi
          ? 'Quét để nhận cảnh báo rung khi xe sắp đến và nhắc xuống đúng bến'
          : 'Scan for haptic alerts when your bus arrives and get-off reminders'}
      </p>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <span className="bp-qr-feature-tag inline-flex items-center gap-1.5 rounded-full border border-kiosk-border bg-white px-3 py-1.5 text-xs font-semibold text-gray-700">
          <Bell className="h-3.5 w-3.5 text-neon-green" strokeWidth={2.5} />
          {isVi ? 'Cảnh báo xe sắp đến' : 'Arrival alerts'}
        </span>
        <span className="bp-qr-feature-tag inline-flex items-center gap-1.5 rounded-full border border-kiosk-border bg-white px-3 py-1.5 text-xs font-semibold text-gray-700">
          <MapPin className="h-3.5 w-3.5 text-neon-green" strokeWidth={2.5} />
          {isVi ? 'Nhắc xuống đúng bến' : 'Get-off reminders'}
        </span>
      </div>

      <button
        type="button"
        onClick={finish}
        className="rounded-xl border-2 border-neon-green bg-white px-8 py-3 text-sm font-bold text-neon-green transition hover:bg-green-50"
      >
        {isVi ? 'Về trang chủ' : 'Back to home'}
      </button>
      </div>
    </div>
  )
}

export function BpHelpScreen({
  lang,
  stationName,
  onBack,
}: {
  lang: BpLang
  stationName: string
  onBack: () => void
}) {
  const [active, setActive] = useState<string | null>(null)
  const content = active ? HELP_CONTENT[active]?.[lang] : null

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <BpKioskHeader lang={lang} stationName={stationName} onBack={() => (active ? setActive(null) : onBack())} />
      <div className="bp-flow kiosk-scroll-pad flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-3">
      <h1 className="mb-4 flex items-center gap-2 font-bold text-neon-green">
        <HelpCircle className="h-5 w-5" strokeWidth={2.5} />
        {tr('helpCenter', lang)}
      </h1>
      {!active ? (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-3">
          {HELP_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActive(cat.id)}
              className="flex flex-col items-center justify-center rounded-xl border-2 border-kiosk-border bg-kiosk-panel p-3 sm:p-4"
            >
              <span className="mb-2 text-[clamp(2rem,8vw,2.5rem)]">{cat.icon}</span>
              <p className="text-center font-semibold">{HELP_TITLES[cat.id]?.[lang]}</p>
            </button>
          ))}
        </div>
      ) : content ? (
        <div className="space-y-4 text-gray-700">
          <ol className="list-decimal space-y-2 pl-5">
            {content.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <ul className="space-y-2">
            {content.faq.map((f) => (
              <li key={f} className="text-sm text-gray-500">
                {f}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      </div>
    </div>
  )
}

