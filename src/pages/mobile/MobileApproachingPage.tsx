import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PhoneFrame } from '../../components/PhoneFrame'
import { MobileShell } from '../../components/mobile/MobileShell'
import { HapticWave } from '../../components/HapticWave'
import { useSyncTripFromUrl } from '../../hooks/useSyncTripFromUrl'
import { buildAppPath } from '../../lib/tripUrl'

/** Tính năng 3 — Vòng nhận thức ngoại vi (Hình 4.3) */
export function MobileApproachingPage() {
  const { query, route, lang, queryString } = useSyncTripFromUrl()
  const isVi = lang === 'vi'

  useEffect(() => {
    if (navigator.vibrate) navigator.vibrate([80, 120, 80, 120, 80])
  }, [])

  return (
    <MobileShell>
      <p className="px-4 pb-2 text-center text-sm text-warning-orange">📷 Hình 4.3 — Haptic approaching</p>
      <PhoneFrame>
        <div className="flex min-h-[520px] flex-col items-center justify-center p-6 text-center">
          <HapticWave />
          <h1 className="mt-4 text-lg font-bold text-neon-cyan">
            {isVi ? 'Xe đang tiến vào trạm' : 'Bus approaching stop'}
          </h1>
          <p className="mt-2 text-3xl font-bold text-white">
            {isVi ? 'Tuyến' : 'Route'} {route?.number ?? '—'}
          </p>
          <p className="mt-4 text-sm text-gray-500">
            {isVi ? 'Rung nhẹ theo nhịp · ~500m' : 'Gentle pulse · ~500m away'}
          </p>
          <p className="mt-6 text-xs text-neon-green">
            {isVi ? 'Không cần nhìn màn hình' : 'No need to look at screen'}
          </p>
        </div>
      </PhoneFrame>
      {query && (
        <div className="mt-6 flex justify-center gap-4 pb-8 text-sm">
          <Link to={buildAppPath(query)} className="text-gray-500 underline">
            ← {isVi ? 'Về App hub' : 'Back to hub'}
          </Link>
          <Link to={`/m?${queryString}`} className="text-neon-green underline">
            {isVi ? 'Chi tiết' : 'Details'}
          </Link>
        </div>
      )}
    </MobileShell>
  )
}
