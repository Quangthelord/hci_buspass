import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Mic } from 'lucide-react'
import { RouteCountdown } from '../components/RouteCountdown'
import { InteractiveMap } from '../components/InteractiveMap'
import { TransparencyEta } from '../components/TransparencyEta'
import { useKiosk } from '../context/KioskContext'
import { DESTINATIONS, ROUTES, getRoute, type Destination } from '../data/mockData'

const PHYSICAL_KEYS = ['A', 'B', 'C', 'D', 'OK', 'QR']

/** Context-Aware E-ink kiosk — Giải pháp A */
export function EinkKioskPage() {
  const navigate = useNavigate()
  const { lang, setDestination, destination, setSelectedRouteId } = useKiosk()
  const [query, setQuery] = useState('')
  const [focusMode, setFocusMode] = useState(false)

  const upcoming = useMemo(
    () => ROUTES.filter((r) => r.etaMinutes <= 15).sort((a, b) => a.etaMinutes - b.etaMinutes),
    [],
  )

  const filteredDest = useMemo(() => {
    const q = query.toLowerCase()
    if (!q) return []
    return DESTINATIONS.filter(
      (d) => d.nameVi.toLowerCase().includes(q) || d.nameEn.toLowerCase().includes(q),
    )
  }, [query])

  const bestRoute = destination
    ? getRoute(
        destination.routes
          .map((id) => getRoute(id))
          .filter(Boolean)
          .sort((a, b) => a!.etaMinutes - b!.etaMinutes)[0]?.id ?? '19',
      )
    : null

  const selectDest = (d: Destination) => {
    setDestination(d)
    setFocusMode(true)
    const rid = d.routes[0]
    setSelectedRouteId(rid)
    setQuery(lang === 'vi' ? d.nameVi : d.nameEn)
  }

  const clearFocus = () => {
    setFocusMode(false)
    setDestination(null)
    setQuery('')
  }

  return (
    <div className="eink-mode flex h-screen flex-col bg-white text-gray-800 lg:h-dvh">
      <header className="flex items-center justify-between border-b border-green-200 bg-green-50 px-6 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest">BusPass · E-ink</p>
          <p className="text-lg font-bold">
            {lang === 'vi' ? 'Trạm Lê Lợi - Nguyễn Huệ' : 'Le Loi - Nguyen Hue'}
          </p>
        </div>
        <p className="text-right text-sm">
          {new Date().toLocaleTimeString(lang === 'vi' ? 'vi-VN' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
          <br />
          32°C · {lang === 'vi' ? 'Nắng nhẹ' : 'Sunny'}
        </p>
      </header>

      <main className="flex min-h-0 flex-1 flex-col p-6">
        {!focusMode ? (
          <>
            <h1 className="mb-2 text-2xl font-bold">
              {lang === 'vi' ? 'Xe sắp đến (15 phút tới)' : 'Arriving soon (next 15 min)'}
            </h1>
            <p className="mb-6 text-sm opacity-70">
              {lang === 'vi'
                ? 'Giao diện tối giản — không chói dưới nắng · Tiết kiệm điện'
                : 'Minimal UI — low glare · Power efficient'}
            </p>

            <div className="mb-6 space-y-4">
              {upcoming.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between border-2 border-[#1a1a1a] bg-[#f5f4f0] p-5"
                >
                  <div>
                    <p className="text-3xl font-bold">Tuyến {r.number}</p>
                    <p className="text-sm">
                      {r.from} → {r.to}
                    </p>
                  </div>
                  <RouteCountdown routeNumber={r.number} etaRange={r.etaRange} lang={lang} large />
                </div>
              ))}
            </div>

            <div className="border-t-2 border-[#1a1a1a] pt-6">
              <p className="mb-2 font-bold">
                {lang === 'vi' ? 'Tôi muốn đến...' : 'I want to go to...'}
              </p>
              <div className="flex gap-2">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={lang === 'vi' ? 'Gõ hoặc nói địa điểm' : 'Type or speak destination'}
                  className="flex-1 border-2 border-[#1a1a1a] bg-white px-4 py-3 text-lg outline-none"
                />
                <button
                  type="button"
                  onClick={() => navigate('/accessibility')}
                  className="border-2 border-[#1a1a1a] px-4"
                  aria-label="Voice"
                >
                  <Mic className="h-6 w-6" />
                </button>
              </div>
              {filteredDest.length > 0 && (
                <ul className="mt-2 border-2 border-[#1a1a1a] bg-white">
                  {filteredDest.map((d) => (
                    <li key={d.id}>
                      <button
                        type="button"
                        onClick={() => selectDest(d)}
                        className="w-full px-4 py-3 text-left hover:bg-[#e8e6e1]"
                      >
                        {d.icon} {lang === 'vi' ? d.nameVi : d.nameEn}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        ) : (
          bestRoute &&
          destination && (
            <div className="flex min-h-0 flex-1 flex-col lg:flex-row lg:gap-6">
              <div className="lg:flex lg:w-[22rem] lg:shrink-0 lg:flex-col">
                <button type="button" onClick={clearFocus} className="mb-4 text-sm underline">
                  ← {lang === 'vi' ? 'Xem tất cả tuyến' : 'Show all routes'}
                </button>
                <p className="mb-2 text-sm uppercase tracking-wide opacity-70">
                  {lang === 'vi' ? 'Chỉ hiển thị tuyến phù hợp nhất' : 'Only the best matching route'}
                </p>
                <h2 className="mb-4 text-3xl font-bold">
                  {lang === 'vi' ? destination.nameVi : destination.nameEn}
                </h2>
                <div className="mb-4 border-2 border-green-200 bg-green-50 p-6">
                  <RouteCountdown routeNumber={bestRoute.number} etaRange={bestRoute.etaRange} lang={lang} large />
                </div>
                <div className="mb-4">
                  <TransparencyEta route={bestRoute} lang={lang} />
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/qr')}
                  className="mt-auto border-2 border-neon-green bg-neon-green py-4 text-xl font-bold text-white lg:mt-4"
                >
                  {lang === 'vi' ? 'Quét QR — Đồng bộ điện thoại' : 'Scan QR — Sync phone'}
                </button>
              </div>
              <div className="mt-4 min-h-[40vh] flex-1 rounded-xl border-2 border-green-200 lg:mt-0 lg:min-h-0">
                <InteractiveMap
                  selectedId={destination.id}
                  onSelect={selectDest}
                  onSwitchList={() => navigate('/list')}
                />
              </div>
            </div>
          )
        )}
      </main>

      <footer className="border-t-2 border-[#1a1a1a] bg-[#d4d2cd] px-4 py-3">
        <p className="mb-2 text-center text-xs font-semibold uppercase">
          {lang === 'vi' ? 'Nút vật lý chống phá hoại' : 'Anti-vandal physical keys'}
        </p>
        <div className="flex justify-center gap-2">
          {PHYSICAL_KEYS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => {
                if (k === 'QR') navigate('/qr')
                if (k === 'OK' && bestRoute) navigate('/qr')
              }}
              className="min-w-[48px] rounded border-2 border-[#333] bg-gradient-to-b from-[#888] to-[#555] px-3 py-4 text-sm font-bold text-white shadow-md active:translate-y-0.5"
            >
              {k}
            </button>
          ))}
        </div>
      </footer>

      <button
        type="button"
        onClick={() => navigate('/mode')}
        className="absolute right-4 top-4 rounded border border-[#1a1a1a] bg-white px-3 py-1 text-sm"
      >
        <ArrowLeft className="inline h-4 w-4" /> {lang === 'vi' ? 'Giao diện đầy đủ' : 'Full UI'}
      </button>
    </div>
  )
}
