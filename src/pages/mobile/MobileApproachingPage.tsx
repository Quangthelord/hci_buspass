import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PhoneFrame } from '../../components/PhoneFrame'
import { HapticWave } from '../../components/HapticWave'
import { useKiosk } from '../../context/KioskContext'
import { getRoute } from '../../data/mockData'

/** Tính năng 3 — Vòng nhận thức ngoại vi (Hình 4.3) */
export function MobileApproachingPage() {
  const navigate = useNavigate()
  const { lang, selectedRouteId } = useKiosk()
  const route = getRoute(selectedRouteId ?? '19')
  const isVi = lang === 'vi'

  useEffect(() => {
    if (navigator.vibrate) navigator.vibrate([80, 120, 80, 120, 80])
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-green-50 p-8">
      <p className="mb-4 text-sm text-warning-orange">📷 Hình 4.3 — Haptic approaching</p>
      <PhoneFrame>
        <div className="flex min-h-[520px] flex-col items-center justify-center p-6 text-center">
          <HapticWave />
          <h1 className="mt-4 text-lg font-bold text-neon-cyan">
            {isVi ? 'Xe đang tiến vào trạm' : 'Bus approaching stop'}
          </h1>
          <p className="mt-2 text-3xl font-bold text-white">
            {isVi ? 'Tuyến' : 'Route'} {route?.number}
          </p>
          <p className="mt-4 text-sm text-gray-500">
            {isVi ? 'Rung nhẹ theo nhịp · ~500m' : 'Gentle pulse · ~500m away'}
          </p>
          <p className="mt-6 text-xs text-neon-green">
            {isVi ? 'Không cần nhìn màn hình' : 'No need to look at screen'}
          </p>
        </div>
      </PhoneFrame>
      <button type="button" onClick={() => navigate('/app')} className="mt-6 text-gray-500 underline">
        ← {isVi ? 'Về App hub' : 'Back to hub'}
      </button>
    </div>
  )
}
