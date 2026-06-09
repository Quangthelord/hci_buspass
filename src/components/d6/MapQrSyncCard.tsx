import { useMemo } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Smartphone } from 'lucide-react'
import type { BusRouteData } from '../../data/busRoutes'
import { buildTripUrl, destinationIdFromName } from '../../lib/tripUrl'

export function MapQrSyncCard({
  route,
  destination,
  stationId,
  lang = 'vi',
  onTap,
}: {
  route: BusRouteData
  destination: string
  stationId: string
  lang?: 'vi' | 'en'
  onTap?: () => void
}) {
  const isVi = lang === 'vi'
  const tripUrl = useMemo(
    () =>
      buildTripUrl({
        r: route.id,
        d: destinationIdFromName(destination),
        s: stationId,
        lang,
      }),
    [route.id, destination, stationId, lang],
  )

  return (
    <button
      type="button"
      onClick={onTap}
      className="d6-qr-sync-card flex w-full items-center gap-3 rounded-2xl border-2 border-neon-green/40 bg-white p-3 text-left transition hover:border-neon-green hover:bg-green-50/50"
    >
      <div className="shrink-0 rounded-lg border border-kiosk-border bg-white p-1.5">
        <QRCodeSVG value={tripUrl} size={72} level="M" includeMargin={false} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 text-sm font-bold text-gray-900">
          <Smartphone className="h-4 w-4 shrink-0 text-neon-green" strokeWidth={2.5} />
          {isVi ? 'Quét QR xem trên điện thoại' : 'Scan QR on your phone'}
        </p>
        <p className="mt-1 text-xs text-gray-600">
          {isVi ? 'Tuyến' : 'Route'} {route.id} · {destination || 'Suối Tiên'}
        </p>
        <p className="mt-0.5 text-[10px] text-gray-400">
          {isVi ? 'Chạm để phóng to mã QR' : 'Tap to enlarge QR'}
        </p>
      </div>
    </button>
  )
}
