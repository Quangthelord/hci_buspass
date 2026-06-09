import { useMemo } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Smartphone } from 'lucide-react'
import type { BusRouteData } from '../../data/busRoutes'
import { buildTripUrl, destinationIdFromName } from '../../lib/tripUrl'

export function RouteQrInline({
  route,
  destination,
  stationId,
  lang,
  onExpand,
}: {
  route: BusRouteData
  destination: string
  stationId: string
  lang: 'vi' | 'en'
  onExpand?: () => void
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

  const qrSize = 100
  const qrNode = (
    <QRCodeSVG value={tripUrl} size={qrSize} level="H" includeMargin={false} />
  )

  return (
    <div className="bp-route-qr rounded-2xl border-2 border-kiosk-border bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4">
        {onExpand ? (
          <button
            type="button"
            onClick={onExpand}
            className="shrink-0 rounded-xl border border-kiosk-border bg-white p-2 transition hover:border-neon-green hover:shadow-md"
            aria-label={isVi ? 'Phóng to mã QR' : 'Enlarge QR code'}
          >
            {qrNode}
          </button>
        ) : (
          <div className="shrink-0 rounded-xl border border-kiosk-border bg-white p-2">{qrNode}</div>
        )}
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <Smartphone className="h-4 w-4 shrink-0 text-neon-green" strokeWidth={2.5} />
            {isVi ? 'Quét để mang lộ trình' : 'Scan to sync route'}
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-gray-600">
            {isVi
              ? 'Đưa điện thoại lên quét — không cần bấm thêm.'
              : 'Hold your phone to scan — no extra taps needed.'}
          </p>
        </div>
      </div>
    </div>
  )
}
