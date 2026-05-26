import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PhoneFrame } from '../../components/PhoneFrame'
import { MobileShell } from '../../components/mobile/MobileShell'
import { HapticWave } from '../../components/HapticWave'
import { useSyncTripFromUrl } from '../../hooks/useSyncTripFromUrl'
import { buildAppPath } from '../../lib/tripUrl'

/** Tính năng 5 — Rung nhắc xuống bến (Hình 4.5) */
export function MobileGetOffPage() {
  const { query, route, lang, queryString } = useSyncTripFromUrl()
  const isVi = lang === 'vi'
  const stops = route?.stops ?? []
  const currentIdx = stops.findIndex((s) => s.isCurrent)

  useEffect(() => {
    if (navigator.vibrate) navigator.vibrate([300, 100, 300, 100, 300, 100, 300])
  }, [])

  return (
    <MobileShell>
      <p className="px-4 pb-2 text-center text-sm text-warning-orange">📷 Hình 4.5 — Get-off reminder</p>
      <PhoneFrame>
        <div className="flex min-h-[520px] flex-col p-4">
          <p className="text-sm font-bold text-neon-green">BusPass · {isVi ? 'Theo dõi chuyến' : 'Trip'}</p>
          <div className="my-3 rounded-lg border-2 border-warning-orange bg-warning-orange/20 p-3 text-center">
            <HapticWave />
            <p className="font-bold text-warning-orange">
              {isVi ? 'Chuẩn bị xuống xe ở trạm kế tiếp!' : 'Prepare to get off at next stop!'}
            </p>
            <p className="text-xs text-gray-500">{isVi ? 'Rung dài liên tục' : 'Long continuous vibration'}</p>
          </div>
          <ul className="flex-1 space-y-2 overflow-y-auto">
            {stops.map((s, i) => {
              const isNext = i === currentIdx + 1
              const isPast = i < currentIdx
              return (
                <li
                  key={s.id}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2 ${
                    isNext
                      ? 'border-warning-orange bg-warning-orange/15'
                      : s.isCurrent
                        ? 'border-neon-green bg-neon-green/10'
                        : 'border-gray-200 opacity-60'
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      isPast ? 'bg-gray-100' : isNext ? 'bg-warning-orange text-black' : 'bg-gray-200'
                    }`}
                  >
                    {isPast ? '✓' : s.id}
                  </span>
                  <span className={isNext ? 'font-bold text-white' : 'text-gray-300'}>{s.name}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </PhoneFrame>
      {query && (
        <div className="mt-6 flex justify-center gap-4 pb-8 text-sm">
          <Link to={buildAppPath(query)} className="text-gray-500 underline">
            ← {isVi ? 'Về App hub' : 'Back to hub'}
          </Link>
          {queryString && (
            <Link to={`/m?${queryString}`} className="text-neon-green underline">
              {isVi ? 'Chi tiết' : 'Details'}
            </Link>
          )}
        </div>
      )}
    </MobileShell>
  )
}
