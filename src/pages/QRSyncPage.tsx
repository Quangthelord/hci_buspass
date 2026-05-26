import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { Check, Smartphone } from 'lucide-react'
import { KioskLayout } from '../components/KioskLayout'
import { KioskNavBar } from '../components/KioskNavBar'
import { HapticTimeline } from '../components/HapticTimeline'
import { DirectionalAudioDemo } from '../components/DirectionalAudioDemo'
import { useKiosk, stationName } from '../context/KioskContext'
import { STATION, getRoute } from '../data/mockData'
import { tr } from '../i18n/translations'

export function QRSyncPage() {
  const navigate = useNavigate()
  const { lang, selectedRouteId, destination, startQrCountdown, qrCountdown, resetSession } = useKiosk()
  const [remoteActive, setRemoteActive] = useState(false)

  const route = getRoute(selectedRouteId ?? '19')

  useEffect(() => {
    startQrCountdown()
  }, [startQrCountdown])

  const payload = useMemo(() => {
    const data = {
      route: route?.number ?? '19',
      destination: destination?.id ?? null,
      destinationName: destination ? (lang === 'vi' ? destination.nameVi : destination.nameEn) : null,
      station: STATION.id,
      eta: route?.etaRange ?? '5',
      ts: Date.now(),
      url: `https://buspass.vn/trip?r=${route?.id}&s=${STATION.id}`,
      remote: true,
    }
    return JSON.stringify(data)
  }, [route, destination, lang])

  const steps =
    lang === 'vi'
      ? [
          'Mở camera hoặc app QR trên điện thoại',
          'Quét mã QR — Không cần cài app',
          'Cho phép thông báo & rung (haptic)',
          'Cất điện thoại — Dùng Remote UI hoặc chờ rung/loa ghế',
        ]
      : [
          'Open camera or QR scanner',
          'Scan — No app install required',
          'Allow notifications & haptics',
          'Pocket phone — Remote UI or wait for haptic/seat audio',
        ]

  return (
    <KioskLayout scrollable>
      <div className="kiosk-scroll-pad flex min-h-0 flex-1 flex-col overflow-y-auto px-8 py-6">
        <KioskNavBar backTo="history" className="mb-4" />
        <h1 className="mb-2 text-center text-2xl font-bold text-neon-green">
          📱 {tr('qrTitle', lang)}
        </h1>
        <p className="mb-4 text-center text-sm text-gray-500">
          {lang === 'vi' ? 'Giải pháp B — Vùng nhận thức ngoại vi' : 'Solution B — Peripheral awareness'}
        </p>

        {qrCountdown !== null && (
          <p className="mb-4 text-center text-warning-orange">
            {tr('resetIn', lang)} {Math.floor(qrCountdown / 60)}:
            {String(qrCountdown % 60).padStart(2, '0')}
          </p>
        )}

        <div className="mx-auto rounded-2xl border-2 border-neon-green bg-white p-6 neon-border">
          <QRCodeSVG value={payload} size={280} level="M" includeMargin />
          <div className="mt-4 text-left text-sm text-white">
            <p className="font-bold">Tuyến {route?.number} · {stationName(lang)}</p>
            <p className="text-slate-600">{tr('qrBenefits', lang)}</p>
          </div>
        </div>

        <div className="mx-auto mt-8 grid w-full max-w-4xl gap-6 lg:grid-cols-2">
          <HapticTimeline lang={lang} routeNumber={route?.number ?? '19'} />
          <DirectionalAudioDemo lang={lang} routeNumber={route?.number ?? '19'} />
        </div>

        <div className="mx-auto mt-8 w-full max-w-lg rounded-xl border border-neon-cyan/40 bg-kiosk-panel p-6">
          <h3 className="mb-3 flex items-center gap-2 font-bold text-neon-cyan">
            <Smartphone className="h-5 w-5" />
            {lang === 'vi' ? 'Remote UI — Điện thoại làm bàn điều khiển' : 'Remote UI — Phone as controller'}
          </h3>
          <p className="mb-4 text-sm text-gray-500">
            {lang === 'vi'
              ? 'Giải pháp Rủi ro 1: Không cần chạm màn hình kiosk sau khi quét'
              : 'Risk 1 fix: No need to touch kiosk screen after scan'}
          </p>
          <button
            type="button"
            onClick={() => setRemoteActive(true)}
            className={`w-full rounded-lg border py-3 font-semibold ${
              remoteActive
                ? 'border-neon-green bg-neon-green/10 text-neon-green'
                : 'border-neon-cyan text-neon-cyan'
            }`}
          >
            {remoteActive
              ? lang === 'vi'
                ? '✓ Đã liên kết — Điều khiển từ điện thoại'
                : '✓ Linked — Control from phone'
              : lang === 'vi'
                ? 'Mô phỏng: Đã quét QR'
                : 'Simulate: Scanned QR'}
          </button>
          {remoteActive && (
            <button
              type="button"
              onClick={() => navigate('/trip')}
              className="mt-4 w-full rounded border border-gray-200 py-2 text-sm"
            >
              {lang === 'vi' ? 'Đổi điểm đến' : 'Change destination'}
            </button>
          )}
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
            onClick={() => navigate('/app')}
            className="btn-kiosk flex items-center gap-2 rounded-xl bg-neon-green px-6 py-3 font-bold text-white"
          >
            <Check className="h-5 w-5" />
            {tr('scannedDone', lang)} → App
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
