import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Bus,
  Clock,
  MapPin,
  Navigation,
  Smartphone,
  Train,
  Car,
  Footprints,
} from 'lucide-react'
import { KioskLayout } from '../components/KioskLayout'
import { KioskNavBar } from '../components/KioskNavBar'
import { ProductLayerTag } from '../components/ProductLayerTag'
import { useKiosk, stationName } from '../context/KioskContext'
import { DESTINATIONS } from '../data/mockData'
import { CRITERIA_ORDER, planTrips, type TripCriteria, type TripLeg } from '../data/tripPlanner'
import { tr } from '../i18n/translations'

const CRITERIA_LABEL: Record<TripCriteria, Record<string, string>> = {
  fastest: { vi: '⚡ Nhanh nhất', en: '⚡ Fastest', zh: '⚡ 最快', ko: '⚡ 최단' },
  cheapest: { vi: '💰 Rẻ nhất', en: '💰 Cheapest', zh: '💰 最便宜', ko: '💰 최저가' },
  leastTransfers: { vi: '🔄 Ít đổi tuyến', en: '🔄 Fewest transfers', zh: '🔄 少换乘', ko: '🔄 최소 환승' },
}

function LegIcon({ mode }: { mode: TripLeg['mode'] }) {
  const cls = 'h-5 w-5'
  switch (mode) {
    case 'bus':
      return <Bus className={cls} />
    case 'metro':
      return <Train className={cls} />
    case 'grab':
      return <Car className={cls} />
    default:
      return <Footprints className={cls} />
  }
}

export function TripPlannerPage() {
  const navigate = useNavigate()
  const { lang, setDestination, setSelectedRouteId } = useKiosk()
  const [destId, setDestId] = useState('')
  const [criteria, setCriteria] = useState<TripCriteria>('fastest')

  const plans = useMemo(() => (destId ? planTrips(destId, lang) : []), [destId, lang])
  const active = plans.find((p) => p.criteria === criteria) ?? plans[0]
  const dest = DESTINATIONS.find((d) => d.id === destId)

  const confirm = () => {
    if (!active || !dest) return
    setDestination(dest)
    setSelectedRouteId(active.primaryRouteId)
    navigate('/qr')
  }

  return (
    <KioskLayout scrollable>
      <div className="kiosk-page-pad kiosk-scroll-pad mx-auto w-full max-w-5xl px-4 py-4 sm:px-6 lg:max-w-6xl lg:px-10">
        <div className="mb-4 flex shrink-0 flex-wrap items-start justify-between gap-3">
          <KioskNavBar backTo="/mode" className="mb-0 flex-1 border-0 pb-0" />
          <ProductLayerTag layer="decision" lang={lang} />
        </div>

        <h1 className="mb-1 text-2xl font-bold text-neon-green sm:text-3xl">
          {lang === 'vi' ? 'TÔI MUỐN ĐI TỪ A → B' : 'GET ME FROM A → B'}
        </h1>
        <p className="mb-5 text-sm text-gray-500 sm:mb-6">
          {lang === 'vi' ? 'Google Maps mini · Gợi ý lộ trình tối ưu' : 'Mini trip planner · Optimized routes'}
        </p>

        {/* A → B — laptop: 2 cột; mobile: xếp dọc */}
        <div className="mb-5 grid grid-cols-1 items-stretch gap-3 sm:grid-cols-[1fr_auto_1fr] sm:gap-4">
          <div className="rounded-xl border-2 border-neon-green/40 bg-neon-green/5 p-4">
            <p className="text-xs font-medium text-neon-green">A — {lang === 'vi' ? 'Xuất phát' : 'From'}</p>
            <p className="mt-1 flex items-center gap-2 font-bold text-gray-800">
              <MapPin className="h-5 w-5 shrink-0 text-neon-green" />
              <span className="line-clamp-2">{stationName(lang)}</span>
            </p>
          </div>
          <div className="hidden items-center justify-center sm:flex">
            <ArrowRight className="h-8 w-8 text-neon-green" />
          </div>
          <div className="rounded-xl border-2 border-kiosk-border bg-kiosk-panel p-4">
            <p className="text-xs font-medium text-green-700">B — {lang === 'vi' ? 'Điểm đến' : 'To'}</p>
            <select
              value={destId}
              onChange={(e) => {
                setDestId(e.target.value)
                setCriteria('fastest')
              }}
              className="mt-1 w-full rounded-lg border-0 bg-transparent text-base font-bold text-gray-800 outline-none sm:text-lg"
            >
              <option value="">{lang === 'vi' ? 'Chọn điểm đến...' : 'Choose destination...'}</option>
              {DESTINATIONS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.icon} {lang === 'vi' ? d.nameVi : d.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {!destId && (
          <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
            <Navigation className="mb-4 h-16 w-16 text-neon-green/30" />
            <p>{lang === 'vi' ? 'Chọn điểm đến để xem gợi ý lộ trình' : 'Select a destination to see route options'}</p>
          </div>
        )}

        {destId && active && (
          <>
            <div className="mb-4 flex flex-wrap gap-2">
              {CRITERIA_ORDER.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCriteria(c)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    criteria === c
                      ? 'border-neon-green bg-neon-green text-white'
                      : 'border-kiosk-border bg-white text-gray-600 hover:border-neon-green'
                  }`}
                >
                  {CRITERIA_LABEL[c][lang]}
                </button>
              ))}
            </div>

            {/* Nội dung lộ trình — cuộn theo trang, không cuộn trong hộp */}
            <div className="mb-4 rounded-2xl border border-kiosk-border bg-kiosk-panel p-4 sm:p-6">
              {active.badge && (
                <span className="mb-3 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                  ★ {active.badge[lang]}
                </span>
              )}
              <div className="mb-6 flex flex-wrap gap-4 sm:gap-6">
                <Stat
                  icon={<Clock className="h-4 w-4" />}
                  label={lang === 'vi' ? 'Tổng thời gian' : 'Total time'}
                  value={`~${active.totalMinutes} ${tr('minutes', lang)}`}
                />
                <Stat
                  icon={<Navigation className="h-4 w-4" />}
                  label={lang === 'vi' ? 'Đổi tuyến' : 'Transfers'}
                  value={String(active.transfers)}
                />
                <Stat
                  icon={<span className="text-base">₫</span>}
                  label={lang === 'vi' ? 'Chi phí' : 'Cost'}
                  value={`${active.totalFare.toLocaleString('vi-VN')}đ`}
                />
              </div>

              <h3 className="mb-3 font-bold text-green-800">{lang === 'vi' ? 'Các chặng' : 'Legs'}</h3>
              <ol className="space-y-4">
                {active.legs.map((leg, i) => (
                  <li key={i} className="flex gap-3 border-l-2 border-neon-green/50 pl-4 sm:gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-kiosk-border bg-white text-neon-green">
                      <LegIcon mode={leg.mode} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800">{leg.label}</p>
                      {leg.detail && <p className="text-sm text-gray-500">{leg.detail}</p>}
                      <p className="text-sm font-medium text-warning-orange">
                        ~{leg.durationMin} {tr('minutes', lang)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/map')}
                  className="rounded-lg border border-neon-green px-4 py-2 text-sm font-medium text-neon-green hover:bg-neon-green/5"
                >
                  {lang === 'vi' ? 'Xem trên bản đồ' : 'View on map'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/route/' + active.primaryRouteId)}
                  className="rounded-lg border border-kiosk-border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-neon-green"
                >
                  {tr('viewDetail', lang)}
                </button>
              </div>
            </div>

            {/* Thanh CTA cố định dưới — luôn thấy khi cuộn */}
            <div className="sticky bottom-0 z-20 -mx-4 border-t border-kiosk-border bg-white/95 px-4 py-4 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
              <button
                type="button"
                onClick={confirm}
                className="btn-kiosk flex w-full items-center justify-center gap-2 rounded-xl bg-neon-green py-4 text-lg font-bold text-white shadow-md transition hover:bg-green-700 sm:py-5 sm:text-xl"
              >
                <Smartphone className="h-6 w-6" />
                {tr('syncPhone', lang)}
              </button>
            </div>
          </>
        )}
      </div>
    </KioskLayout>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <p className="flex items-center gap-1 text-xs text-gray-500">
        {icon} {label}
      </p>
      <p className="text-lg font-bold text-gray-900 sm:text-xl">{value}</p>
    </div>
  )
}
