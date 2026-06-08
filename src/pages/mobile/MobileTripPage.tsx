import { Link } from 'react-router-dom'
import { Bus, ChevronRight } from 'lucide-react'
import { PhoneFrame } from '../../components/PhoneFrame'
import { MobileShell } from '../../components/mobile/MobileShell'
import { MobileHapticStatus } from '../../components/mobile/MobileHapticStatus'
import { TripDetailContent } from '../../components/mobile/TripDetailContent'
import { useShowPhoneFrame } from '../../hooks/useShowPhoneFrame'
import { useSyncTripFromUrl } from '../../hooks/useSyncTripFromUrl'
import { useTripHaptic } from '../../hooks/useTripHaptic'
import { buildAppPath } from '../../lib/tripUrl'
import { stationName } from '../../context/KioskContext'

/** Màn hình sau quét QR — chi tiết chuyến trên điện thoại (`/m?r=&d=&lang=`). */
export function MobileTripPage() {
  const { query, route, dest, lang } = useSyncTripFromUrl()
  const showFrame = useShowPhoneFrame()
  const isVi = lang === 'vi'
  const routeId = query?.r ?? '01'
  const haptic = useTripHaptic(routeId)

  if (!route || !query) {
    return (
      <MobileShell badge={isVi ? 'BusPass Mobile' : 'BusPass Mobile'}>
        <div className="p-6 text-center">
          <p className="text-gray-600">
            {isVi ? 'Liên kết không hợp lệ. Quét lại mã QR tại kiosk.' : 'Invalid link. Scan the kiosk QR again.'}
          </p>
          <p className="mt-4 text-xs text-gray-400">?r=01&d=suoi-tien&s=ben-thanh&lang=vi</p>
        </div>
      </MobileShell>
    )
  }

  const content = (
    <div className="p-4 pb-10">
      <div className="mb-4 flex items-center gap-2">
        <Bus className="h-6 w-6 text-neon-green" />
        <div>
          <p className="font-bold text-neon-green">BusPass</p>
          <p className="text-xs text-gray-500">{stationName(lang)}</p>
        </div>
      </div>

      <p className="mb-3 rounded-lg bg-neon-green/15 px-3 py-2 text-center text-sm font-semibold text-neon-green">
        {isVi ? '✓ Đã đồng bộ từ kiosk' : '✓ Synced from kiosk'}
      </p>

      <MobileHapticStatus
        lang={lang}
        level={haptic.level}
        isArriving={haptic.isArriving}
        distanceM={haptic.distanceM}
        armed={haptic.armed}
        canVibrate={haptic.canVibrate}
        onArm={haptic.armHaptic}
      />

      <TripDetailContent route={route} dest={dest} lang={lang} />

      <Link
        to={buildAppPath(query)}
        className="btn-kiosk mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-neon-green py-4 text-lg font-bold text-white"
      >
        {isVi ? 'Tiếp tục hành trình' : 'Continue journey'}
        <ChevronRight className="h-5 w-5" />
      </Link>

      <p className="mt-4 text-center text-xs text-gray-400">
        {isVi ? 'Rung tự động khi xe gần trạm (~500m)' : 'Auto haptic when bus is ~500m away'}
      </p>
    </div>
  )

  return (
    <MobileShell badge={showFrame ? (isVi ? '📱 Sau khi quét QR' : '📱 After QR scan') : undefined}>
      {showFrame ? (
        <PhoneFrame label={isVi ? 'Chi tiết chuyến' : 'Trip details'}>{content}</PhoneFrame>
      ) : (
        content
      )}
    </MobileShell>
  )
}
