import { HapticWave } from '../HapticWave'
import type { UrgencyLevel } from '../../lib/mockRealtime'

export function MobileHapticStatus({
  lang,
  level,
  isArriving,
  distanceM,
  armed,
  canVibrate,
  onArm,
}: {
  lang: 'vi' | 'en' | 'zh' | 'ko'
  level: UrgencyLevel
  isArriving: boolean
  distanceM: number
  armed: boolean
  canVibrate: boolean
  onArm: () => void
}) {
  const isVi = lang === 'vi'

  if (!armed) {
    return (
      <div className="mb-4 rounded-xl border-2 border-neon-green bg-white p-4 text-center">
        <p className="text-sm font-semibold text-gray-700">
          {isVi ? 'Bật rung khi xe đến trạm' : 'Enable haptic when bus arrives'}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {isVi
            ? 'Chạm nút bên dưới (iOS yêu cầu thao tác người dùng)'
            : 'Tap below (iOS requires a user gesture)'}
        </p>
        <button
          type="button"
          onClick={onArm}
          className="btn-kiosk mt-3 w-full rounded-lg bg-neon-green py-3 text-sm font-bold text-white"
        >
          {isVi ? 'KÍCH HOẠT RUNG 📳' : 'ENABLE HAPTIC 📳'}
        </button>
        {!canVibrate && (
          <p className="mt-2 text-xs text-warning-orange">
            {isVi ? 'Trình duyệt không hỗ trợ rung' : 'Vibration not supported'}
          </p>
        )}
      </div>
    )
  }

  if (isArriving) {
    return (
      <div
        className="mb-4 rounded-xl border-2 border-warning-orange bg-warning-orange/15 p-4 text-center"
        role="alert"
      >
        <HapticWave />
        <p className="mt-2 text-base font-bold text-warning-orange">
          {isVi ? 'Xe đang vào trạm!' : 'Bus is arriving!'}
        </p>
        <p className="text-xs text-gray-600">{isVi ? 'Đang rung mạnh' : 'Strong vibration active'}</p>
      </div>
    )
  }

  if (level >= 2) {
    return (
      <div className="mb-4 rounded-xl border-2 border-neon-green bg-neon-green/10 p-3 text-center">
        <HapticWave />
        <p className="mt-1 text-sm font-semibold text-neon-green">
          {isVi ? 'Xe sắp đến · Đang rung' : 'Bus approaching · Vibrating'}
        </p>
        <p className="text-xs text-gray-500">~{distanceM}m</p>
      </div>
    )
  }

  if (level === 1) {
    return (
      <p className="mb-4 rounded-lg bg-gray-100 px-3 py-2 text-center text-xs text-gray-600">
        {isVi ? `Theo dõi chuyến · Xe cách ~${distanceM}m` : `Tracking · Bus ~${distanceM}m away`}
      </p>
    )
  }

  return (
    <p className="mb-4 rounded-lg bg-neon-green/10 px-3 py-2 text-center text-xs text-neon-green">
      {isVi ? '✓ Rung đã bật — Cất máy vào túi' : '✓ Haptic on — Pocket your phone'}
    </p>
  )
}
