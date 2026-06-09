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
  onSelect,
}: {
  route: BusRouteData
  destination: string
  minutes: number
  delayMinutes: number
  active?: boolean
  searchMode?: boolean
  lang?: 'vi' | 'en'
  onSelect?: () => void
}) {
  const Tag = onSelect ? 'button' : 'div'
  const onTime = delayMinutes === 0
  const isVi = lang === 'vi'

  return (
    <Tag
      type={onSelect ? 'button' : undefined}
      onClick={onSelect}
      className={`d6-arrival-hero w-full rounded-2xl border-2 text-left transition-colors ${
        active ? 'd6-arrival-hero--active' : 'border-kiosk-border bg-white'
      }`}
    >
      <div className="flex items-stretch justify-between gap-3">
        <div className="min-w-0 flex-1 py-1">
          <p className="d6-arrival-hero-label text-xs font-bold uppercase tracking-wider text-gray-500">
            {searchMode
              ? isVi
                ? 'Kết quả tra cứu'
                : 'Search result'
              : isVi
                ? 'Tuyến tiếp theo'
                : 'Next route'}
          </p>
          <p className="d6-arrival-hero-route mt-1 font-bold text-gray-900">
            {formatRouteLabel(route.id)}
          </p>
          <p className="d6-arrival-hero-dest mt-0.5 text-sm font-semibold text-neon-green">
            {isVi ? 'Hướng' : 'To'}: {destination}
          </p>
          {!onTime && (
            <p className="d6-arrival-hero-delay mt-2 text-sm font-semibold text-gray-700">
              {isVi ? 'Dự kiến' : 'ETA'} {minutes} {isVi ? 'phút' : 'min'}
              <span className="ml-1 text-gray-500">
                ({isVi ? 'đã tính trễ' : 'incl. delay'} {delayMinutes}′)
              </span>
            </p>
          )}
          {onTime && (
            <p className="d6-arrival-hero-delay mt-2 text-sm font-semibold text-green-800">
              {isVi ? 'Đúng lịch' : 'On time'} ✓
            </p>
          )}
        </div>
        <div className="d6-arrival-hero-eta flex shrink-0 flex-col items-center justify-center rounded-xl bg-neon-green/10 px-4 py-2">
          <span className="d6-arrival-hero-eta-num font-black tabular-nums leading-none text-neon-green">
            {minutes}
          </span>
          <span className="d6-arrival-hero-eta-unit mt-0.5 text-xs font-bold uppercase tracking-wide text-neon-green">
            {isVi ? 'phút' : 'min'}
          </span>
        </div>
      </div>
    </Tag>
  )
}
