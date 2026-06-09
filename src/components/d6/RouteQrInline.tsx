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
  layout = 'stack',
  qrSize,
}: {
  route: BusRouteData
  destination: string
  stationId: string
  lang: 'vi' | 'en'
  onExpand?: () => void
  /** stack = thẻ dọc; dock = vùng QR cố định 1/3 màn hình */
  layout?: 'stack' | 'dock'
  qrSize?: number
}) {
  const isVi = lang === 'vi'
  const size = qrSize ?? (layout === 'dock' ? 168 : 192)

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

  const qrNode = <QRCodeSVG value={tripUrl} size={size} level="H" includeMargin={false} />

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

  if (layout === 'dock') {
    return (
      <div className="bp-route-qr bp-route-qr--dock w-full">
        <div className="bp-route-qr-dock-inner flex w-full min-w-0 flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="bp-route-qr-copy w-full min-w-0 flex-1 break-words sm:text-left">
            <p className="flex w-full items-start justify-center gap-2 text-base font-bold leading-snug text-gray-900 sm:justify-start">
              <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-neon-green" strokeWidth={2.5} />
              <span className="min-w-0 flex-1 break-words">
                {isVi
                  ? 'Quét QR để mang lộ trình theo người — Không cần bấm thêm.'
                  : 'Scan QR to take the route with you — no extra taps needed.'}
              </span>
            </p>
          </div>
          <div className="bp-route-qr-visual flex shrink-0 justify-center">{qrBlock}</div>
        </div>
      </div>
    )
  }

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
      <div className="bp-route-qr-visual flex w-full justify-center px-4 pb-5 pt-4">{qrBlock}</div>
    </div>
  )
}
