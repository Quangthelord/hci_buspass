import { HapticWave } from '../HapticWave'
import type { UrgencyLevel } from '../../lib/mockRealtime'

export function MobileHapticStatus({
  lang,
  level,
  isArriving,
  isAlerting,
  distanceM,
  armed,
  alertStopped,
  canVibrate,
  onArm,
  onStop,
}: {
  lang: 'vi' | 'en' | 'zh' | 'ko'
  level: UrgencyLevel
  isArriving: boolean
  isAlerting: boolean
  distanceM: number
  armed: boolean
  alertStopped: boolean
  canVibrate: boolean
  onArm: () => void
  onStop: () => void
}) {
  const isVi = lang === 'vi'

  if (!armed) {
    return (
      <div className="mb-4 rounded-xl border-2 border-neon-green bg-white p-4 text-center">
        <p className="text-sm font-semibold text-gray-700">
          {isVi ? 'Bật rung + tiếng kêu khi xe đến trạm' : 'Enable haptic + beep when bus arrives'}
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

  if (isAlerting || isArriving) {
    return (
      <div
        className="mb-4 rounded-xl border-2 border-warning-orange bg-warning-orange/15 p-4 text-center"
        role="alert"
        aria-live="assertive"
      >
        <HapticWave />
        <p className="mt-2 text-base font-bold text-warning-orange">
          {isArriving
            ? isVi
              ? 'Xe đang vào trạm!'
              : 'Bus is arriving!'
            : isVi
              ? 'Xe sắp đến!'
              : 'Bus approaching!'}
        </p>
        <p className="mt-1 text-xs text-gray-600">
          {isVi ? 'Đang rung dài + tiếng kêu' : 'Long vibration + beeping'}
          {!isArriving && ` · ~${distanceM}m`}
        </p>
        <button
          type="button"
          onClick={onStop}
          className="btn-kiosk mt-4 w-full rounded-lg border-2 border-warning-orange bg-white py-3 text-base font-bold text-warning-orange"
        >
          {isVi ? '■ DỪNG RUNG' : '■ STOP ALERT'}
        </button>
      </div>
    )
  }

  if (alertStopped) {
    return (
      <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3 text-center">
        <p className="text-xs text-gray-600">
          {isVi ? 'Đã dừng cảnh báo rung' : 'Alert stopped'}
        </p>
        <button
          type="button"
          onClick={onArm}
          className="mt-2 text-xs font-semibold text-neon-green underline"
        >
          {isVi ? 'Bật lại' : 'Turn back on'}
        </button>
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
