import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import {
  Accessibility,
  Check,
  Headphones,
  List,
  Map,
  Navigation,
  Smartphone,
} from 'lucide-react'
import type { BusRouteData } from '../../data/busRoutes'
import { buildTripUrl } from '../../lib/tripUrl'
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
    <div className="kiosk-scroll-pad welcome-animate flex min-h-0 flex-1 flex-col px-6 py-6 lg:px-10">
      <section className="flex flex-1 flex-col items-center justify-center text-center lg:flex-row lg:items-center lg:gap-16 lg:text-left">
        <div className="lg:max-w-md lg:flex-1">
          <p className="mb-2 text-5xl lg:text-6xl">🚏</p>
          <h1 className="mb-2 text-3xl font-bold leading-tight text-neon-green md:text-4xl">
            {tr('welcomeTitle', lang)}
          </h1>
          <p className="mb-2 text-xl text-green-700">{tr('welcomeSub', lang)}</p>
          <p className="text-sm text-gray-500">{stationName}</p>
        </div>
        <div className="grid w-full max-w-xl grid-cols-2 gap-3 lg:flex-1">
          {LANGS.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => onLang(l.code)}
              className={`btn-kiosk rounded-xl border-2 border-kiosk-border bg-white font-bold text-neon-green shadow-sm transition hover:border-neon-green hover:bg-neon-green hover:text-white ${
                l.size === 'lg' ? 'py-6 text-xl' : 'py-4 text-base'
              }`}
            >
              <span className="mr-2">{l.flag}</span>
              {l.label}
            </button>
          ))}
        </div>
      </section>
      <footer className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-kiosk-border pt-6">
        <p className="text-gray-500">{tr('routesAtStation', lang, { n: routeCount })}</p>
        <button
          type="button"
          onClick={onHelp}
          className="btn-kiosk flex items-center gap-2 rounded-lg border border-neon-green bg-neon-green px-5 py-3 text-white"
        >
          <Headphones className="h-5 w-5" />
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
    <div className="kiosk-scroll-pad px-6 py-6 lg:px-10">
      <button type="button" onClick={onBack} className="mb-4 text-neon-green">
        ← {lang === 'vi' ? 'Quay lại' : 'Back'}
      </button>
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-neon-green neon-text">{tr('modeQuestion', lang)}</h1>
        <p className="mt-2 text-lg text-gray-500">{tr('modeQuestionSub', lang)}</p>
      </div>

      <button
        type="button"
        onClick={onTrip}
        className="btn-kiosk mb-6 flex w-full items-center justify-between rounded-2xl border-2 border-neon-green bg-neon-green/10 px-8 py-6 text-left"
      >
        <div>
          <p className="text-2xl font-bold text-neon-green">
            {lang === 'vi' ? 'Tôi muốn đi từ A → B' : 'I want to go from A → B'}
          </p>
          <p className="text-gray-500">
            {lang === 'vi' ? 'Gợi ý nhanh đến Suối Tiên' : 'Quick trip to Suối Tiên'}
          </p>
        </div>
        <Navigation className="h-14 w-14 text-neon-green" />
      </button>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ModeCard
          icon={<Map className="h-16 w-16 text-neon-green" />}
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
          icon={<List className="h-16 w-16 text-green-700" />}
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
      <p className="mt-6 text-center text-sm text-gray-500">💡 {tr('modeTip', lang)}</p>
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
    <div className="flex flex-col rounded-2xl border-2 border-kiosk-border bg-kiosk-panel p-6">
      {badge && (
        <span className="mb-3 w-fit rounded-full bg-neon-green/20 px-3 py-1 text-xs font-bold text-neon-green">
          ★ {badge}
        </span>
      )}
      <div className="mb-4 flex justify-center">{icon}</div>
      <h2 className="text-center text-2xl font-bold">{title}</h2>
      <p className="mb-4 text-center text-gray-500">{subtitle}</p>
      <ul className="mb-6 space-y-2 text-sm text-gray-600">
        {benefits.map((b) => (
          <li key={b}>✓ {b}</li>
        ))}
      </ul>
      <button type="button" onClick={onSelect} className={`btn-kiosk w-full rounded-xl py-4 text-lg font-bold ${btn}`}>
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
    <div className="kiosk-scroll-pad relative flex min-h-0 flex-1 flex-col px-6 py-4">
      <button type="button" onClick={onBack} className="mb-3 text-neon-green">
        ← {lang === 'vi' ? 'Chế độ' : 'Mode'}
      </button>
      <header className="mb-4">
        <h1 className="text-3xl font-bold text-neon-cyan">📋 {tr('listTitle', lang)}</h1>
        <p className="text-warning-orange">[{tr('easyRead', lang)}]</p>
      </header>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`🔍 ${tr('searchPlaceholder', lang)}`}
        className="mb-4 w-full rounded-xl border-2 border-kiosk-border px-5 py-4 text-xl outline-none focus:border-neon-cyan"
      />
      <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto lg:grid-cols-2">
        {filtered.map((r) => {
          const dest = r.stops[r.stops.length - 1]?.name ?? ''
          const wait = r.stops[0].nextArrival + r.currentDelay
          return (
            <article key={r.id} className="rounded-2xl border-2 border-neon-green/40 bg-kiosk-panel p-5">
              <h2 className="text-3xl font-bold text-neon-green">TUYẾN {r.id}</h2>
              <p className="mt-2 text-xl">
                📍 {r.stops[0]?.name} → {dest}
              </p>
              <p className="mt-2 text-2xl font-bold text-neon-green">
                {wait}–{wait + 5} {lang === 'vi' ? 'phút' : 'min'}
              </p>
              {r.delayReason && (
                <p className="mt-1 text-sm text-warning-orange">⚠️ {r.delayReason}</p>
              )}
              <button
                type="button"
                onClick={() => onRoute(r)}
                className="btn-kiosk mt-4 w-full rounded-xl border-2 border-neon-cyan py-4 text-xl font-bold text-neon-cyan"
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
        className="fixed bottom-20 right-6 z-40 flex flex-col items-center rounded-full border-2 border-neon-green bg-white px-4 py-3 text-sm text-neon-green shadow-lg"
      >
        <Map className="h-8 w-8" />
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
    <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
      <div className="min-w-0 flex-1 overflow-y-auto border-b border-kiosk-border p-6 lg:border-b-0 lg:border-r">
        <button type="button" onClick={onBack} className="mb-4 text-neon-green">
          ← {lang === 'vi' ? 'Quay lại' : 'Back'}
        </button>
        <h1 className="text-4xl font-bold text-neon-green">🚌 TUYẾN {route.id}</h1>
        <hr className="my-4 border-kiosk-border" />
        <section className="mb-6">
          <h2 className="font-bold text-neon-cyan">📍 {tr('mainRoute', lang)}</h2>
          <p className="mt-2 text-lg">
            {route.stops[0]?.name} → {dest}
          </p>
        </section>
        <section className="mb-6">
          <h2 className="font-bold text-neon-cyan">⏱️ {lang === 'vi' ? 'Thời gian' : 'Schedule'}</h2>
          <p className="mt-2">
            {lang === 'vi' ? 'Xe sắp đến' : 'Next bus'}: <strong>{wait} phút</strong>
          </p>
          {route.delayReason && <p className="text-warning-orange">⚠️ {route.delayReason}</p>}
        </section>
        <section className="mb-6">
          <h2 className="font-bold text-neon-cyan">💰 {lang === 'vi' ? 'Giá vé' : 'Fare'}</h2>
          <p className="mt-2">7.000₫ · SV 3.500₫</p>
        </section>
        <button
          type="button"
          onClick={onSync}
          className="btn-kiosk flex w-full items-center justify-center gap-2 rounded-xl bg-neon-green py-5 text-xl font-bold text-white"
        >
          <Smartphone className="h-6 w-6" />
          {lang === 'vi' ? 'CHỌN TUYẾN NÀY VÀ ĐỒNG BỘ 📱' : 'SYNC TO PHONE 📱'}
        </button>
      </div>
      <div className="min-w-0 flex-1 overflow-y-auto p-6">
        <h2 className="mb-4 font-bold">📍 {lang === 'vi' ? 'Các trạm dừng' : 'All stops'}</h2>
        <ol className="space-y-2">
          {route.stops.map((stop, i) => (
            <li
              key={stop.id}
              className={`rounded-lg border px-4 py-3 ${
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

  useEffect(() => {
    const t = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [])

  const tripUrl = buildTripUrl({ r: route.id, s: stationId, lang })

  return (
    <div className="kiosk-scroll-pad flex min-h-0 flex-1 flex-col overflow-y-auto px-8 py-6">
      <button type="button" onClick={onBack} className="mb-4 self-start text-neon-green">
        ← {lang === 'vi' ? 'Quay lại' : 'Back'}
      </button>
      <h1 className="mb-2 text-center text-2xl font-bold text-neon-green">📱 {tr('qrTitle', lang)}</h1>
      {countdown > 0 && (
        <p className="mb-4 text-center text-warning-orange">
          {tr('resetIn', lang)} {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
        </p>
      )}
      <div className="mx-auto w-full max-w-md rounded-2xl border-2 border-neon-green bg-white p-6">
        <QRCodeSVG value={tripUrl} size={260} level="M" includeMargin className="mx-auto" />
        <div className="mt-4 text-center text-sm">
          <p className="font-bold text-neon-green">
            Tuyến {route.id} · {destination}
          </p>
          <p className="mt-1 text-gray-500">{tr('qrBenefits', lang)}</p>
        </div>
      </div>
      <ol className="mx-auto mt-8 max-w-lg space-y-2">
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
      <div className="mt-8 flex justify-center gap-4">
        <button
          type="button"
          onClick={onDone}
          className="btn-kiosk flex items-center gap-2 rounded-xl bg-neon-green px-6 py-3 font-bold text-white"
        >
          <Check className="h-5 w-5" />
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
    <div className="kiosk-scroll-pad flex min-h-0 flex-1 flex-col px-8 py-6">
      <button
        type="button"
        onClick={() => (active ? setActive(null) : onBack())}
        className="mb-4 self-start text-neon-green"
      >
        ← {lang === 'vi' ? 'Quay lại' : 'Back'}
      </button>
      <h1 className="mb-6 text-3xl font-bold text-neon-cyan">❓ {tr('helpCenter', lang)}</h1>
      {!active ? (
        <div className="grid flex-1 grid-cols-2 gap-4 lg:grid-cols-3">
          {HELP_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActive(cat.id)}
              className="flex flex-col items-center justify-center rounded-2xl border-2 border-kiosk-border bg-kiosk-panel p-6"
            >
              <span className="mb-3 text-5xl">{cat.icon}</span>
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

export function BpAccessibilityScreen({
  lang,
  onBack,
}: {
  lang: BpLang
  onBack: () => void
}) {
  const [highContrast, setHighContrast] = useState(false)
  const [largeText, setLargeText] = useState(false)

  return (
    <div className="kiosk-scroll-pad px-8 py-6">
      <button type="button" onClick={onBack} className="mb-4 text-neon-green">
        ← {lang === 'vi' ? 'Quay lại' : 'Back'}
      </button>
      <h1 className="mb-6 flex items-center gap-2 text-3xl font-bold text-neon-cyan">
        <Accessibility className="h-8 w-8" />
        {lang === 'vi' ? 'Hỗ trợ đặc biệt' : 'Accessibility'}
      </h1>
      <div className="space-y-4">
        <label className="flex items-center justify-between rounded-xl border-2 border-kiosk-border p-4">
          <span>{lang === 'vi' ? 'Tương phản cao' : 'High contrast'}</span>
          <input type="checkbox" checked={highContrast} onChange={(e) => setHighContrast(e.target.checked)} />
        </label>
        <label className="flex items-center justify-between rounded-xl border-2 border-kiosk-border p-4">
          <span>{lang === 'vi' ? 'Chữ lớn' : 'Large text'}</span>
          <input type="checkbox" checked={largeText} onChange={(e) => setLargeText(e.target.checked)} />
        </label>
      </div>
      {highContrast && (
        <p className="mt-4 text-sm text-gray-500">
          {lang === 'vi' ? 'Chế độ tương phản sẽ áp dụng khi reload.' : 'Contrast mode applies on reload.'}
        </p>
      )}
    </div>
  )
}

export function BpFlowChrome({
  lang,
  onHelp,
  onA11y,
  onList,
}: {
  lang: BpLang
  onHelp: () => void
  onA11y: () => void
  onList: () => void
}) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <button
        type="button"
        onClick={onList}
        className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-neon-green bg-white text-neon-green shadow-lg"
        title={tr('switchList', lang)}
      >
        <List className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={onHelp}
        className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-neon-cyan bg-white text-neon-cyan shadow-lg"
      >
        <Headphones className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={onA11y}
        className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-400 bg-white shadow-lg"
      >
        <Accessibility className="h-5 w-5" />
      </button>
    </div>
  )
}

