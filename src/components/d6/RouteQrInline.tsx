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

  const qrSize = 80
  const qrNode = (
    <QRCodeSVG value={tripUrl} size={qrSize} level="H" includeMargin={false} />
  )

  const qrBlock = onExpand ? (
    <button
      type="button"
      onClick={onExpand}
      className="bp-route-qr-code shrink-0 rounded-lg border border-kiosk-border bg-white p-2 transition hover:border-neon-green"
      aria-label={isVi ? 'Phóng to mã QR' : 'Enlarge QR code'}
    >
      {qrNode}
    </button>
  ) : (
    <div className="bp-route-qr-code shrink-0 rounded-lg border border-kiosk-border bg-white p-2">
      {qrNode}
    </div>
  )

  return (
    <div className="bp-route-qr w-full rounded-xl border border-kiosk-border bg-white p-3 shadow-sm">
      <div className="flex items-start gap-3">
        {qrBlock}
        <div className="min-w-[8rem] flex-1">
          <p className="flex items-center gap-1.5 text-sm font-bold leading-snug text-gray-900">
            <Smartphone className="h-4 w-4 shrink-0 text-neon-green" strokeWidth={2.5} />
            {isVi ? 'Quét mang lộ trình về điện thoại' : 'Scan route to your phone'}
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-gray-600">
            {isVi
              ? 'Đưa camera lên quét mã — không cần bấm thêm.'
              : 'Point your camera at the code — no extra taps.'}
          </p>
        </div>
      </div>
    </div>
  )
}
