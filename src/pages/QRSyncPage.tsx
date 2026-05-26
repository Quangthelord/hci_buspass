import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { Check, Copy, Smartphone } from 'lucide-react'
import { KioskLayout } from '../components/KioskLayout'
import { KioskNavBar } from '../components/KioskNavBar'
import { HapticTimeline } from '../components/HapticTimeline'
import { DirectionalAudioDemo } from '../components/DirectionalAudioDemo'
import { useKiosk, stationName } from '../context/KioskContext'
import { STATION, getRoute } from '../data/mockData'
import { buildTripUrl, tripQueryToSearchParams } from '../lib/tripUrl'
import { tr } from '../i18n/translations'

export function QRSyncPage() {
  const navigate = useNavigate()
  const { lang, selectedRouteId, destination, startQrCountdown, qrCountdown, resetSession } = useKiosk()
  const [remoteActive, setRemoteActive] = useState(false)
  const [copied, setCopied] = useState(false)

  const route = getRoute(selectedRouteId ?? '19')

  const tripUrl = useMemo(
    () =>
      buildTripUrl({
        r: route?.id ?? '19',
        d: destination?.id,
        s: STATION.id,
        lang,
      }),
    [route?.id, destination?.id, lang],
  )

  const openOnPhone = () => {
    window.open(tripUrl, '_blank', 'noopener,noreferrer')
  }

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(tripUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    startQrCountdown()
  }, [startQrCountdown])

  const steps =
    lang === 'vi'
      ? [
          'Mở camera trên điện thoại',
          'Quét mã QR — Trình duyệt mở trang chi tiết chuyến',
          'Xem tuyến, ETA, trạm dừng trên điện thoại',
          'Tiếp tục — Rung / thanh toán / nhắc xuống bến',
        ]
      : [
          'Open phone camera',
          'Scan QR — Browser opens trip details',
          'View route, ETA, stops on your phone',
          'Continue — Haptic / pay / get-off alerts',
        ]

  return (
    <KioskLayout scrollable>
      <div className="kiosk-scroll-pad flex min-h-0 flex-1 flex-col overflow-y-auto px-8 py-6">
        <KioskNavBar backTo="history" className="mb-4" />
        <h1 className="mb-2 text-center text-2xl font-bold text-neon-green">
          📱 {tr('qrTitle', lang)}
        </h1>
        <p className="mb-4 text-center text-sm text-gray-500">
          {lang === 'vi'
            ? 'Quét QR mở link thật trên điện thoại (không cần cài app)'
            : 'Scan QR to open a real link on your phone (no app install)'}
        </p>

        {qrCountdown !== null && (
          <p className="mb-4 text-center text-warning-orange">
            {tr('resetIn', lang)} {Math.floor(qrCountdown / 60)}:
            {String(qrCountdown % 60).padStart(2, '0')}
          </p>
        )}

        <div className="mx-auto w-full max-w-md rounded-2xl border-2 border-neon-green bg-white p-6 neon-border">
          <QRCodeSVG value={tripUrl} size={280} level="M" includeMargin className="mx-auto" />
          <div className="mt-4 text-center text-sm">
            <p className="font-bold text-neon-green">
              Tuyến {route?.number} · {stationName(lang)}
            </p>
            {destination && (
              <p className="text-gray-600">
                → {lang === 'vi' ? destination.nameVi : destination.nameEn}
              </p>
            )}
            <p className="mt-1 text-gray-500">{tr('qrBenefits', lang)}</p>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={copyUrl}
              className="btn-kiosk flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-200 py-2 text-xs text-gray-600"
            >
              <Copy className="h-4 w-4" />
              {copied ? (lang === 'vi' ? 'Đã copy' : 'Copied') : lang === 'vi' ? 'Copy link' : 'Copy link'}
            </button>
            <button
              type="button"
              onClick={openOnPhone}
              className="btn-kiosk flex-1 rounded-lg bg-neon-green/10 py-2 text-xs font-semibold text-neon-green"
            >
              {lang === 'vi' ? 'Mở trên máy này' : 'Open here'}
            </button>
          </div>
          <p className="mt-2 break-all text-center text-[10px] text-gray-400">{tripUrl}</p>
        </div>

        <div className="mx-auto mt-8 grid w-full max-w-4xl gap-6 lg:grid-cols-2">
          <HapticTimeline lang={lang} routeNumber={route?.number ?? '19'} />
          <DirectionalAudioDemo lang={lang} routeNumber={route?.number ?? '19'} />
        </div>

        <div className="mx-auto mt-8 w-full max-w-lg rounded-xl border border-neon-cyan/40 bg-kiosk-panel p-6">
          <h3 className="mb-3 flex items-center gap-2 font-bold text-neon-cyan">
            <Smartphone className="h-5 w-5" />
            {lang === 'vi' ? 'Demo trên cùng máy' : 'Same-device demo'}
          </h3>
          <button
            type="button"
            onClick={() => {
              setRemoteActive(true)
              openOnPhone()
            }}
            className={`w-full rounded-lg border py-3 font-semibold ${
              remoteActive
                ? 'border-neon-green bg-neon-green/10 text-neon-green'
                : 'border-neon-cyan text-neon-cyan'
            }`}
          >
            {remoteActive
              ? lang === 'vi'
                ? '✓ Đã mở trang mobile'
                : '✓ Mobile page opened'
              : lang === 'vi'
                ? 'Mô phỏng: Đã quét QR'
                : 'Simulate: Scanned QR'}
          </button>
        </div>

        <ol className="mx-auto mt-8 max-w-lg space-y-2 text-left">
          {steps.map((s, i) => (
            <li key={s} className="flex gap-3">
              <span className="text-neon-green">{i + 1}.</span>
              {s}
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={() => {
              const params = tripQueryToSearchParams({
                r: route?.id ?? '19',
                d: destination?.id,
                s: STATION.id,
                lang,
              })
              navigate(`/m?${params.toString()}`)
            }}
            className="btn-kiosk flex items-center gap-2 rounded-xl bg-neon-green px-6 py-3 font-bold text-white"
          >
            <Check className="h-5 w-5" />
            {lang === 'vi' ? 'Xem trên mobile (tab này)' : 'Mobile view (this tab)'}
          </button>
          <button
            type="button"
            onClick={resetSession}
            className="btn-kiosk rounded-xl border border-gray-200 px-6 py-3"
          >
            {lang === 'vi' ? 'Kết thúc phiên' : 'End session'}
          </button>
        </div>
      </div>
    </KioskLayout>
  )
}
