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
  qrSize = 192,
}: {
  route: BusRouteData
  destination: string
  stationId: string
  lang: 'vi' | 'en'
  onExpand?: () => void
  /** Kích thước QR (px) — kiosk 1080×1920 khuyến nghị 180–200 */
  qrSize?: number
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

  const qrNode = (
    <QRCodeSVG value={tripUrl} size={qrSize} level="H" includeMargin={false} />
  )

  const qrBlock = onExpand ? (
    <button
      type="button"
      onClick={onExpand}
      className="bp-route-qr-code rounded-xl border border-kiosk-border bg-white p-3 transition hover:border-neon-green"
      aria-label={isVi ? 'Phóng to mã QR' : 'Enlarge QR code'}
    >
      {qrNode}
    </button>
  ) : (
    <div className="bp-route-qr-code rounded-xl border border-kiosk-border bg-white p-3">
      {qrNode}
    </div>
  )

  return (
    <div className="bp-route-qr bp-route-qr--stack w-full rounded-xl border border-kiosk-border bg-white shadow-sm">
      <div className="bp-route-qr-copy w-full px-4 pt-4 text-left">
        <p className="flex items-start gap-2 text-base font-bold leading-snug text-gray-900">
          <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-neon-green" strokeWidth={2.5} />
          <span className="min-w-0 break-words">
            {isVi ? 'Quét QR để mang lộ trình theo người' : 'Scan QR to take the route with you'}
          </span>
        </p>
        <p className="mt-2 break-words text-sm leading-relaxed text-gray-700">
          {isVi
            ? 'Đưa camera lên quét mã — không cần bấm thêm.'
            : 'Point your camera at the code — no extra taps.'}
        </p>
      </div>
      <div className="bp-route-qr-visual flex w-full justify-center px-4 pb-5 pt-4">
        {qrBlock}
      </div>
    </div>
  )
}
