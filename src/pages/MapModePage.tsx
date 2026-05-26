import { useNavigate } from 'react-router-dom'
import { List, Smartphone } from 'lucide-react'
import { KioskLayout } from '../components/KioskLayout'
import { KioskNavBar, KioskNavBarStrip } from '../components/KioskNavBar'
import { InteractiveMap } from '../components/InteractiveMap'
import { TransparencyEta } from '../components/TransparencyEta'
import { RouteCountdown } from '../components/RouteCountdown'
import { useKiosk } from '../context/KioskContext'
import { DESTINATIONS, ROUTES } from '../data/mockData'
import { tr } from '../i18n/translations'

export function MapModePage() {
  const navigate = useNavigate()
  const { lang, destination, setDestination, setSelectedRouteId, speak } = useKiosk()

  const selectDest = (d: (typeof DESTINATIONS)[0]) => {
    setDestination(d)
    speak(lang === 'vi' ? `Đã chọn ${d.nameVi}` : `Selected ${d.nameEn}`)
  }

  const matchingRoutes = destination
    ? ROUTES.filter((r) => destination.routes.includes(r.id)).sort((a, b) => a.etaMinutes - b.etaMinutes)
    : []

  const primary = matchingRoutes[0]
  const alts = matchingRoutes.slice(1)

  const goSync = (routeId: string) => {
    setSelectedRouteId(routeId)
    navigate('/qr')
  }

  const goDetail = (routeId: string) => {
    setSelectedRouteId(routeId)
    navigate('/route/' + routeId)
  }

  return (
    <KioskLayout scrollable={false}>
      <KioskNavBarStrip>
        <KioskNavBar
          backTo="/mode"
          className="border-0 pb-0"
          links={[{ to: '/list', label: tr('switchList', lang), icon: List }]}
        />
      </KioskNavBarStrip>
      <div className="map-panel-laptop flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="min-h-[40vh] min-w-0 flex-1 p-3 pr-2 lg:min-h-0 lg:p-4">
          <InteractiveMap
            selectedId={destination?.id ?? null}
            onSelect={selectDest}
            onSwitchList={() => navigate('/list')}
          />
        </div>

        <aside className="map-aside-laptop flex min-h-0 w-full flex-col border-t border-kiosk-border bg-kiosk-panel/80 lg:max-h-full lg:border-l lg:border-t-0 lg:bg-kiosk-panel/50">
          {!destination ? (
            <>
              <div className="shrink-0 p-4 pb-2">
                <h2 className="mb-1 text-xl font-bold text-neon-green">🎯 {tr('chooseDestination', lang)}</h2>
                <p className="text-sm text-gray-500">{tr('popularPlaces', lang)}</p>
              </div>
              <div className="map-aside-scroll min-h-0 flex-1 space-y-3 overflow-y-auto px-4">
                {DESTINATIONS.slice(0, 6).map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => selectDest(d)}
                    className="w-full rounded-lg border border-kiosk-border bg-kiosk-bg p-4 text-left transition hover:border-neon-green"
                  >
                    <p className="font-bold">
                      {d.icon} {lang === 'vi' ? d.nameVi : d.nameEn}
                    </p>
                    <p className="text-sm text-neon-cyan">
                      {d.distanceKm} km • {tr('routeDetail', lang).replace('CHI TIẾT ', '')} {d.routes[0]}
                    </p>
                  </button>
                ))}
              </div>
              <p className="shrink-0 px-4 py-3 text-xs text-gray-500">💡 {tr('mapTip', lang)}</p>
            </>
          ) : (
            <>
              <div className="shrink-0 border-b border-kiosk-border/60 p-4 pb-3">
                <h2 className="text-lg font-bold text-neon-cyan">
                  📍 {tr('toDestination', lang)} {lang === 'vi' ? destination.nameVi : destination.nameEn}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {destination.distanceKm} km {tr('fromStation', lang)}
                </p>
              </div>

              <div className="map-aside-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3">
                <p className="mb-3 font-bold text-neon-green">🚌 {tr('matchingRoutes', lang)}</p>

                {primary && (
                  <div className="mb-4 rounded-xl border-2 border-neon-green neon-border bg-kiosk-bg p-4">
                    <p className="text-center text-3xl font-bold text-neon-green">TUYẾN {primary.number}</p>
                    <div className="my-3 flex justify-center">
                      <RouteCountdown routeNumber={primary.number} etaRange={primary.etaRange} lang={lang} large />
                    </div>
                    <TransparencyEta route={primary} lang={lang} />
                    <p className="mt-2 text-center text-xs text-gray-500">
                      {lang === 'vi' ? 'Đã ẩn tuyến không liên quan' : 'Unrelated routes hidden'}
                    </p>
                    <button
                      type="button"
                      onClick={() => goDetail(primary.id)}
                      className="mt-3 w-full text-sm text-neon-cyan underline"
                    >
                      {tr('viewDetail', lang)}
                    </button>
                  </div>
                )}

                {alts.length > 0 && (
                  <div className="mb-2">
                    <hr className="mb-2 border-kiosk-border" />
                    <p className="text-sm font-semibold">🚌 {tr('altRoutes', lang)}:</p>
                    <ul className="mt-1 space-y-1 text-sm text-gray-600">
                      {alts.map((r) => (
                        <li key={r.id}>
                          → Tuyến {r.number}: {r.etaRange} {tr('minutes', lang)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="shrink-0 border-t border-kiosk-border bg-kiosk-panel/90 p-4">
                <button
                  type="button"
                  onClick={() => primary && goSync(primary.id)}
                  className="btn-kiosk flex w-full items-center justify-center gap-2 rounded-xl bg-neon-green py-4 text-lg font-bold text-white transition hover:brightness-110 lg:py-5"
                >
                  <Smartphone className="h-6 w-6" />
                  {tr('syncPhone', lang)} 📱
                </button>
              </div>
            </>
          )}
        </aside>
      </div>
    </KioskLayout>
  )
}
