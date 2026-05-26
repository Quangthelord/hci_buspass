import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PhoneFrame } from '../../components/PhoneFrame'
import { HapticWave } from '../../components/HapticWave'
import { useKiosk } from '../../context/KioskContext'
import { getRoute } from '../../data/mockData'

/** Tính năng 5 — Rung nhắc xuống bến (Hình 4.5) */
export function MobileGetOffPage() {
  const navigate = useNavigate()
  const { lang, selectedRouteId } = useKiosk()
  const route = getRoute(selectedRouteId ?? '19')
  const isVi = lang === 'vi'
  const stops = route?.stops ?? []
  const currentIdx = stops.findIndex((s) => s.isCurrent)

  useEffect(() => {
    if (navigator.vibrate) navigator.vibrate([300, 100, 300, 100, 300, 100, 300])
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-green-50 p-8">
      <p className="mb-4 text-sm text-warning-orange">📷 Hình 4.5 — Get-off reminder</p>
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
                  <span className={isNext ? 'font-bold' : ''}>{s.name}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </PhoneFrame>
      <button type="button" onClick={() => navigate('/app')} className="mt-6 text-gray-500 underline">
        ← {isVi ? 'Về App hub' : 'Back to hub'}
      </button>
    </div>
  )
}
