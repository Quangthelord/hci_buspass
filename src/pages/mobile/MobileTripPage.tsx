import { Link } from 'react-router-dom'
import { Bus, ChevronRight } from 'lucide-react'
import { PhoneFrame } from '../../components/PhoneFrame'
import { MobileShell } from '../../components/mobile/MobileShell'
import { TripDetailContent } from '../../components/mobile/TripDetailContent'
import { useSyncTripFromUrl } from '../../hooks/useSyncTripFromUrl'
import { buildAppPath } from '../../lib/tripUrl'
import { stationName } from '../../context/KioskContext'

/** Màn hình sau quét QR — chi tiết chuyến trên điện thoại (`/m?r=&d=&lang=`). */
export function MobileTripPage() {
  const { query, route, dest, lang } = useSyncTripFromUrl()
  const isVi = lang === 'vi'

  if (!route || !query) {
    return (
      <MobileShell badge={isVi ? 'BusPass Mobile' : 'BusPass Mobile'}>
        <div className="p-6 text-center">
          <p className="text-gray-600">
            {isVi ? 'Liên kết không hợp lệ. Quét lại mã QR tại kiosk.' : 'Invalid link. Scan the kiosk QR again.'}
          </p>
          <p className="mt-4 text-xs text-gray-400">?r=routeId&d=destinationId&lang=vi</p>
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

      <p className="mb-4 rounded-lg bg-neon-green/15 px-3 py-2 text-center text-sm font-semibold text-neon-green">
        {isVi ? '✓ Đã đồng bộ từ kiosk — Xem chi tiết chuyến' : '✓ Synced from kiosk — Trip details'}
      </p>

      <TripDetailContent route={route} dest={dest} lang={lang} />

      <Link
        to={buildAppPath(query)}
        className="btn-kiosk mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-neon-green py-4 text-lg font-bold text-white"
      >
        {isVi ? 'Tiếp tục hành trình' : 'Continue journey'}
        <ChevronRight className="h-5 w-5" />
      </Link>

      <p className="mt-4 text-center text-xs text-gray-400">
        {isVi ? 'Rung · Thanh toán · Nhắc xuống bến' : 'Haptic · Pay · Get-off alerts'}
      </p>
    </div>
  )

  return (
    <MobileShell badge={isVi ? '📱 Sau khi quét QR' : '📱 After QR scan'}>
      <PhoneFrame label={isVi ? 'Chi tiết chuyến' : 'Trip details'}>{content}</PhoneFrame>
    </MobileShell>
  )
}
