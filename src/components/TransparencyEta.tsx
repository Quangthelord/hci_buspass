import type { BusRoute, Lang } from '../data/mockData'
import { trafficLabel } from '../data/mockData'

/** Minh bạch sai số — Rủi ro 2: Transparency in Uncertainty */
export function TransparencyEta({
  route,
  lang,
  className = '',
}: {
  route: BusRoute
  lang: Lang
  className?: string
}) {
  return (
    <div className={`rounded-lg border border-warning-orange/40 bg-warning-orange/5 p-3 ${className}`}>
      <p className="text-2xl font-bold text-warning-orange">
        {route.etaRange} {lang === 'vi' ? 'phút' : 'min'}
      </p>
      <p className="text-sm text-gray-600">
        {lang === 'vi' ? 'Khoảng thời gian dự kiến (không phải một con số cố định)' : 'Estimated range (not a fixed number)'}
      </p>
      <p className="mt-2 text-sm text-gray-500">🚦 {trafficLabel(route.traffic, lang)}</p>
      {route.alert && (
        <p className="mt-1 text-sm font-medium text-warning-orange">⚠️ {route.alert}</p>
      )}
      <p className="mt-2 text-xs text-neon-cyan">
        {lang === 'vi'
          ? '→ Xem chấm xe di chuyển trên bản đồ để tự đánh giá'
          : '→ Watch the bus dot on the map to judge for yourself'}
      </p>
    </div>
  )
}
