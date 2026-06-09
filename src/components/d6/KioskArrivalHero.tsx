import { Bus } from 'lucide-react'
import type { BusRouteData } from '../../data/busRoutes'
import { formatRouteLabel } from '../../lib/formatVi'

export function KioskArrivalHero({
  route,
  destination,
  minutes,
  delayMinutes,
  active,
  searchMode,
  lang = 'vi',
  readOnly = false,
  onSelect,
}: {
  route: BusRouteData
  destination: string
  minutes: number
  delayMinutes: number
  active?: boolean
  searchMode?: boolean
  lang?: 'vi' | 'en'
  /** Chỉ hiển thị — không chạm (vùng nhìn trên kiosk). */
  readOnly?: boolean
  onSelect?: () => void
}) {
  const Tag = onSelect && !readOnly ? 'button' : 'div'
  const onTime = delayMinutes === 0
  const isVi = lang === 'vi'

  return (
    <Tag
      type={onSelect ? 'button' : undefined}
      onClick={onSelect}
      className={`d6-arrival-hero w-full rounded-xl border text-left transition-colors ${
        active
          ? 'd6-arrival-hero--active border-kiosk-border bg-[#f5f5f5]'
          : 'border-kiosk-border bg-[#f5f5f5]'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="d6-arrival-hero-label font-bold uppercase tracking-wider text-gray-500">
            {searchMode
              ? isVi
                ? 'Kết quả tra cứu'
                : 'Search result'
              : isVi
                ? 'Tuyến tiếp theo'
                : 'Next route'}
          </p>
          <p className="d6-arrival-hero-route font-bold text-gray-900">
            {formatRouteLabel(route.id)}
          </p>
          <p className="d6-arrival-hero-dest font-semibold text-neon-green">
            {isVi ? 'Hướng' : 'To'}: {destination}
          </p>
          {!onTime && (
            <p className="d6-arrival-hero-delay font-semibold text-gray-700">
              {isVi ? 'Dự kiến' : 'ETA'} {minutes} {isVi ? 'phút' : 'min'}
              <span className="ml-1 text-gray-500">
                ({isVi ? 'đã tính trễ' : 'incl. delay'} {delayMinutes}′)
              </span>
            </p>
          )}
          {onTime && (
            <p className="d6-arrival-hero-delay font-semibold text-green-800">
              {isVi ? 'Đúng lịch' : 'On time'} ✓
            </p>
          )}
        </div>
        <div className="d6-arrival-hero-eta flex shrink-0 flex-col items-center justify-center rounded-xl bg-white px-3 py-2 shadow-sm">
          <Bus className="d6-arrival-hero-eta-icon mb-0.5 text-neon-green" strokeWidth={2.5} />
          <span className="d6-arrival-hero-eta-num font-black tabular-nums leading-none text-neon-green">
            {minutes}
          </span>
          <span className="d6-arrival-hero-eta-unit font-bold uppercase text-neon-green">
            {isVi ? 'phút' : 'min'}
          </span>
        </div>
      </div>
    </Tag>
  )
}
