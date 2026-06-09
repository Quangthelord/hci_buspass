import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import {
  Check,
  Headphones,
  List,
  Map,
  Navigation,
  Smartphone,
} from 'lucide-react'
import type { BusRouteData } from '../../data/busRoutes'
import { QrOriginSetup } from '../../components/mobile/QrOriginSetup'
import { buildTripUrl, destinationIdFromName } from '../../lib/tripUrl'
import { HELP_CATEGORIES, HELP_CONTENT, HELP_TITLES, tr } from '../../i18n/translations'
import type { BpLang } from './constants'

const LANGS: { code: BpLang; label: string; flag: string; size: 'lg' | 'sm' }[] = [
  { code: 'vi', label: 'TIẾNG VIỆT', flag: '🇻🇳', size: 'lg' },
  { code: 'en', label: 'ENGLISH', flag: '🇬🇧', size: 'lg' },
]

export function BpHomeScreen({
  lang,
  stationName,
  routeCount,
  onLang,
  onHelp,
}: {
  lang: BpLang
  stationName: string
  routeCount: number
  onLang: (l: BpLang) => void
  onHelp: () => void
}) {
  return (
    <div className="bp-flow kiosk-scroll-pad welcome-animate flex flex-col px-[var(--bp-space-x,1.25rem)] py-[var(--bp-space-y,1.25rem)] lg:min-h-0 lg:flex-1 lg:px-8">
      <section className="flex flex-col items-center py-4 text-center lg:flex-1 lg:flex-row lg:items-center lg:justify-center lg:gap-10 lg:py-0 lg:text-left">
        <div className="lg:max-w-sm lg:flex-1">
          <p className="mb-2 text-[clamp(2rem,8vw,2.5rem)] lg:text-5xl">🚏</p>
          <h1 className="mb-2 font-bold leading-tight text-neon-green">
            {tr('welcomeTitle', lang)}
          </h1>
          <p className="mb-2 text-green-700">{tr('welcomeSub', lang)}</p>
          <p className="text-[var(--bp-caption,0.875rem)] text-gray-500">{stationName}</p>
        </div>
        <div className="mt-5 grid w-full max-w-md grid-cols-2 gap-2.5 lg:mt-0 lg:flex-1">
          {LANGS.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => onLang(l.code)}
              className={`btn-kiosk rounded-xl border-2 border-kiosk-border bg-white font-bold text-neon-green shadow-sm transition hover:border-neon-green hover:bg-neon-green hover:text-white ${
                l.size === 'lg' ? 'py-3.5 text-[clamp(0.9375rem,3.8vw,1.125rem)]' : 'py-3 text-base'
              }`}
            >
              <span className="mr-1.5">{l.flag}</span>
              {l.label}
            </button>
          ))}
        </div>
      </section>
      <footer className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-kiosk-border pt-4">
        <p className="text-sm text-gray-500">{tr('routesAtStation', lang, { n: routeCount })}</p>
        <button
          type="button"
          onClick={onHelp}
          className="btn-kiosk flex items-center gap-2 rounded-lg border border-neon-green bg-neon-green px-4 py-2.5 text-sm text-white"
        >
          <Headphones className="h-4 w-4" />
          {tr('help', lang)}
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
  return (
    <div className="bp-flow kiosk-scroll-pad px-[var(--bp-space-x,1.25rem)] py-[var(--bp-space-y,1.25rem)] lg:px-8">
      <button type="button" onClick={onBack} className="mb-3 text-sm text-neon-green">
        ← {lang === 'vi' ? 'Quay lại' : 'Back'}
      </button>
      <div className="mb-4 text-center">
        <h1 className="font-bold text-neon-green neon-text">{tr('modeQuestion', lang)}</h1>
        <p className="mt-2 text-gray-500">{tr('modeQuestionSub', lang)}</p>
      </div>

      <button
        type="button"
        onClick={onTrip}
        className="btn-kiosk mb-4 flex w-full items-center justify-between rounded-xl border-2 border-neon-green bg-neon-green/10 px-4 py-3.5 text-left sm:px-5 sm:py-4"
      >
        <div className="min-w-0 pr-3">
          <p className="font-bold text-neon-green">
            {lang === 'vi' ? 'Tôi muốn đi từ A → B' : 'I want to go from A → B'}
          </p>
          <p className="mt-1 text-[var(--bp-caption,0.875rem)] text-gray-500">
            {lang === 'vi' ? 'Gợi ý nhanh đến Suối Tiên' : 'Quick trip to Suối Tiên'}
          </p>
        </div>
        <Navigation className="h-8 w-8 shrink-0 text-neon-green sm:h-10 sm:w-10" />
      </button>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <ModeCard
          icon={<Map className="h-8 w-8 text-neon-green sm:h-10 sm:w-10" />}
          title={tr('mapMode', lang)}
          subtitle="Visual Map Mode"
          badge={tr('recommended', lang)}
          benefits={[
            lang === 'vi' ? 'Nhìn thấy vị trí xe thời gian thực' : 'Real-time bus positions',
            lang === 'vi' ? 'Đường chỉ dẫn neon rõ ràng' : 'Neon directions',
          ]}
          accent="green"
          lang={lang}
          onSelect={onMap}
        />
        <ModeCard
          icon={<List className="h-8 w-8 text-green-700 sm:h-10 sm:w-10" />}
          title={tr('listMode', lang)}
          subtitle="List Mode"
          benefits={[
            lang === 'vi' ? 'Chữ lớn, dễ đọc' : 'Large readable text',
            lang === 'vi' ? 'Phù hợp người lớn tuổi' : 'Senior-friendly',
          ]}
          accent="cyan"
          lang={lang}
          onSelect={onList}
        />
      </div>
      <p className="mt-4 text-center text-xs text-gray-500">💡 {tr('modeTip', lang)}</p>
    </div>
  )
}

function ModeCard({
  icon,
  title,
  subtitle,
  badge,
  benefits,
  accent,
  lang,
  onSelect,
}: {
  icon: ReactNode
  title: string
  subtitle: string
  badge?: string
  benefits: string[]
  accent: 'green' | 'cyan'
  lang: BpLang
  onSelect: () => void
}) {
  const btn = accent === 'green' ? 'bg-neon-green text-white' : 'bg-green-700 text-white'
  return (
    <div className="flex flex-col rounded-xl border-2 border-kiosk-border bg-kiosk-panel p-3.5 sm:p-4">
      {badge && (
        <span className="mb-2 w-fit rounded-full bg-neon-green/20 px-2.5 py-0.5 text-[10px] font-bold text-neon-green sm:text-[11px]">
          ★ {badge}
        </span>
      )}
      <div className="mb-3 flex justify-center">{icon}</div>
      <h2 className="text-center font-bold">{title}</h2>
      <p className="mb-3 text-center text-[var(--bp-caption,0.875rem)] text-gray-500">{subtitle}</p>
      <ul className="mb-4 space-y-1.5 text-[var(--bp-caption,0.875rem)] text-gray-600">
        {benefits.map((b) => (
          <li key={b}>✓ {b}</li>
        ))}
      </ul>
      <button type="button" onClick={onSelect} className={`btn-kiosk w-full rounded-lg py-3 text-base font-bold ${btn}`}>
        {tr('selectMode', lang)}
      </button>
    </div>
  )
}

export function BpListScreen({
  lang,
  routes,
  onRoute,
  onMap,
  onBack,
}: {
  lang: BpLang
  routes: BusRouteData[]
  onRoute: (r: BusRouteData) => void
  onMap: () => void
  onBack: () => void
}) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    if (!q) return routes
    return routes.filter(
      (r) =>
        r.id.includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.stops.some((s) => s.name.toLowerCase().includes(q)),
    )
  }, [routes, query])

  return (
    <div className="bp-flow kiosk-scroll-pad relative flex flex-col px-[var(--bp-space-x,1.25rem)] py-3 lg:min-h-0 lg:flex-1">
      <button type="button" onClick={onBack} className="mb-2 text-sm text-neon-green">
        ← {lang === 'vi' ? 'Chế độ' : 'Mode'}
      </button>
      <header className="mb-3">
        <h1 className="font-bold text-neon-cyan">📋 {tr('listTitle', lang)}</h1>
        <p className="text-[var(--bp-caption,0.875rem)] text-warning-orange">[{tr('easyRead', lang)}]</p>
      </header>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`🔍 ${tr('searchPlaceholder', lang)}`}
        className="mb-3 w-full rounded-lg border-2 border-kiosk-border px-4 py-3 outline-none focus:border-neon-cyan"
      />
      <div className="grid gap-3 pb-2 lg:min-h-0 lg:flex-1 lg:grid-cols-2 lg:overflow-y-auto">
        {filtered.map((r) => {
          const dest = r.stops[r.stops.length - 1]?.name ?? ''
          const wait = r.stops[0].nextArrival + r.currentDelay
          return (
            <article key={r.id} className="rounded-xl border-2 border-neon-green/40 bg-kiosk-panel p-3.5 sm:p-4">
              <h2 className="font-bold text-neon-green">TUYẾN {r.id}</h2>
              <p className="mt-1.5">
                📍 {r.stops[0]?.name} → {dest}
              </p>
              <p className="mt-1.5 text-[clamp(1.125rem,4.5vw,1.25rem)] font-bold text-neon-green">
                {wait}–{wait + 5} {lang === 'vi' ? 'phút' : 'min'}
              </p>
              {r.delayReason && (
                <p className="mt-1 text-xs text-warning-orange">⚠️ {r.delayReason}</p>
              )}
              <button
                type="button"
                onClick={() => onRoute(r)}
                className="btn-kiosk mt-3 w-full rounded-lg border-2 border-neon-cyan py-3 text-base font-bold text-neon-cyan"
              >
                {tr('viewDetail', lang)}
              </button>
            </article>
          )
        })}
      </div>
      <button
        type="button"
        onClick={onMap}
        className="fixed bottom-[max(4.5rem,calc(env(safe-area-inset-bottom,0px)+4rem))] right-[max(1rem,env(safe-area-inset-right,0px))] z-40 flex flex-col items-center rounded-full border-2 border-neon-green bg-white px-3 py-2 text-[10px] text-neon-green shadow-lg sm:text-xs"
      >
        <Map className="h-6 w-6" />
        <span>{tr('switchMap', lang)}</span>
      </button>
    </div>
  )
}

export function BpRouteScreen({
  lang,
  route,
  stationName,
  onSync,
  onBack,
}: {
  lang: BpLang
  route: BusRouteData
  stationName: string
  onSync: () => void
  onBack: () => void
}) {
  const dest = route.stops[route.stops.length - 1]?.name ?? ''
  const wait = route.stops[0].nextArrival + route.currentDelay

  return (
    <div className="flex flex-col lg:min-h-0 lg:flex-1 lg:flex-row">
      <div className="bp-flow bp-route-panel min-w-0 border-b border-kiosk-border p-[var(--bp-space-x,1.25rem)] py-4 lg:flex-1 lg:overflow-y-auto lg:border-b-0 lg:border-r lg:p-5">
        <button type="button" onClick={onBack} className="mb-3 text-sm text-neon-green">
          ← {lang === 'vi' ? 'Quay lại' : 'Back'}
        </button>
        <h1 className="font-bold text-neon-green">🚌 TUYẾN {route.id}</h1>
        <hr className="my-3 border-kiosk-border" />
        <section className="mb-4">
          <h2 className="text-sm font-bold text-neon-cyan">📍 {tr('mainRoute', lang)}</h2>
          <p className="mt-1.5 text-base">
            {route.stops[0]?.name} → {dest}
          </p>
        </section>
        <section className="mb-4">
          <h2 className="text-sm font-bold text-neon-cyan">⏱️ {lang === 'vi' ? 'Thời gian' : 'Schedule'}</h2>
          <p className="mt-1.5 text-base">
            {lang === 'vi' ? 'Xe sắp đến' : 'Next bus'}: <strong>{wait} phút</strong>
          </p>
          {route.delayReason && <p className="text-sm text-warning-orange">⚠️ {route.delayReason}</p>}
        </section>
        <section className="mb-4">
          <h2 className="text-sm font-bold text-neon-cyan">💰 {lang === 'vi' ? 'Giá vé' : 'Fare'}</h2>
          <p className="mt-1.5 text-base">7.000₫ · SV 3.500₫</p>
        </section>
        <button
          type="button"
          onClick={onSync}
          className="btn-kiosk flex w-full items-center justify-center gap-2 rounded-lg bg-neon-green py-3.5 text-base font-bold text-white"
        >
          <Smartphone className="h-5 w-5" />
          {lang === 'vi' ? 'CHỌN TUYẾN NÀY VÀ ĐỒNG BỘ 📱' : 'SYNC TO PHONE 📱'}
        </button>
      </div>
      <div className="bp-flow bp-route-panel min-w-0 p-[var(--bp-space-x,1.25rem)] py-4 lg:flex-1 lg:overflow-y-auto lg:p-5">
        <h2 className="mb-3 font-bold">📍 {lang === 'vi' ? 'Các trạm dừng' : 'All stops'}</h2>
        <ol className="space-y-1.5">
          {route.stops.map((stop, i) => (
            <li
              key={stop.id}
              className={`rounded-lg border px-3 py-2.5 text-sm ${
                i === 0 ? 'border-neon-green bg-neon-green/10' : 'border-kiosk-border'
              }`}
            >
              <span className="font-bold">
                {String(i + 1).padStart(2, '0')} — {stop.name}
              </span>
              {i === 0 && (
                <span className="ml-2 text-sm text-neon-green">({stationName})</span>
              )}
              {i === route.stops.length - 1 && (
                <span className="ml-2 text-sm text-neon-cyan">⭐</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export function BpQrScreen({
  lang,
  route,
  destination,
  stationId,
  onDone,
  onBack,
}: {
  lang: BpLang
  route: BusRouteData
  destination: string
  stationId: string
  onDone: () => void
  onBack: () => void
}) {
  const [countdown, setCountdown] = useState(180)
  const [originVersion, setOriginVersion] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [])

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
    <div className="bp-flow kiosk-scroll-pad flex flex-col px-[var(--bp-space-x,1.5rem)] py-[var(--bp-space-y,1.25rem)] lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
      <button type="button" onClick={onBack} className="mb-3 self-start text-sm text-neon-green">
        ← {lang === 'vi' ? 'Quay lại' : 'Back'}
      </button>
      <h1 className="mb-2 text-center font-bold text-neon-green">📱 {tr('qrTitle', lang)}</h1>
      {countdown > 0 && (
        <p className="mb-3 text-center text-sm text-warning-orange">
          {tr('resetIn', lang)} {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
        </p>
      )}
      <QrOriginSetup lang={lang} sampleQuery={tripQuery} onSaved={() => setOriginVersion((v) => v + 1)} />

      <div className="mx-auto w-full max-w-sm rounded-xl border-2 border-neon-green bg-white p-4 sm:p-5">
        <QRCodeSVG
          value={tripUrl}
          size={240}
          level="H"
          includeMargin
          className="bp-qr-code mx-auto h-auto w-full max-w-[240px]"
        />
        <div className="mt-4 text-center text-sm">
          <p className="font-bold text-neon-green">
            Tuyến {route.id} · {destination}
          </p>
          <p className="mt-1 text-gray-500">{tr('qrBenefits', lang)}</p>
          <p className="mt-2 break-all text-[10px] text-gray-400">{tripUrl}</p>
        </div>
      </div>
      <ol className="mx-auto mt-5 max-w-md space-y-1.5 text-sm">
        {(lang === 'vi'
          ? [
              'Mở camera hoặc app QR trên điện thoại',
              'Quét mã QR phía trên',
              'Cho phép nhận thông báo rung',
              'Cất điện thoại vào túi, thư giãn chờ xe',
            ]
          : [
              'Open camera or QR app',
              'Scan the code above',
              'Allow haptic notifications',
              'Pocket your phone and relax',
            ]
        ).map((s, i) => (
          <li key={s} className="flex gap-3">
            <span className="text-neon-green">{i + 1}.</span>
            {s}
          </li>
        ))}
      </ol>
      <div className="mt-5 flex justify-center gap-3">
        <button
          type="button"
          onClick={onDone}
          className="btn-kiosk flex items-center gap-2 rounded-lg bg-neon-green px-5 py-2.5 text-sm font-bold text-white"
        >
          <Check className="h-4 w-4" />
          {lang === 'vi' ? 'ĐÃ QUÉT XONG' : 'DONE'}
        </button>
      </div>
    </div>
  )
}

export function BpHelpScreen({
  lang,
  onBack,
}: {
  lang: BpLang
  onBack: () => void
}) {
  const [active, setActive] = useState<string | null>(null)
  const content = active ? HELP_CONTENT[active]?.[lang] : null

  return (
    <div className="bp-flow kiosk-scroll-pad flex flex-col px-[var(--bp-space-x,1.5rem)] py-[var(--bp-space-y,1.25rem)] lg:min-h-0 lg:flex-1">
      <button
        type="button"
        onClick={() => (active ? setActive(null) : onBack())}
        className="mb-3 self-start text-sm text-neon-green"
      >
        ← {lang === 'vi' ? 'Quay lại' : 'Back'}
      </button>
      <h1 className="mb-4 font-bold text-neon-cyan">❓ {tr('helpCenter', lang)}</h1>
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
  )
}

