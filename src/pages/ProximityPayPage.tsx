import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Nfc, Radio } from 'lucide-react'
import { KioskLayout } from '../components/KioskLayout'
import { ProductLayerTag } from '../components/ProductLayerTag'
import { useKiosk } from '../context/KioskContext'
import { getRoute } from '../data/mockData'
import { tr } from '../i18n/translations'

/** Giải pháp C — Proximity-based Payment (mô phỏng NFC/BLE) */
export function ProximityPayPage() {
  const navigate = useNavigate()
  const { lang, selectedRouteId } = useKiosk()
  const [phase, setPhase] = useState<'idle' | 'detecting' | 'paid'>('idle')
  const route = getRoute(selectedRouteId ?? '19')
  const fare = route?.fare ?? 7000

  const simulateBoarding = () => {
    setPhase('detecting')
    setTimeout(() => setPhase('paid'), 1800)
  }

  return (
    <KioskLayout>
      <div className="flex flex-1 flex-col items-center justify-center px-8 py-6 text-center">
        <div className="mb-6 self-start">
          <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500">
            <ArrowLeft className="h-5 w-5" />
            {tr('back', lang)}
          </button>
        </div>
        <ProductLayerTag layer="assistance" lang={lang} />

        <h1 className="mt-4 text-3xl font-bold text-neon-green">
          {lang === 'vi' ? 'THANH TOÁN TẦM NGẮN' : 'PROXIMITY PAYMENT'}
        </h1>
        <p className="mb-8 max-w-lg text-gray-500">
          {lang === 'vi'
            ? 'NFC / Bluetooth — Hai tay bám vịn, không cần quét QR khi lên xe'
            : 'NFC / Bluetooth — Hands free on boarding, no QR scan on stairs'}
        </p>

        <div
          className={`relative flex h-64 w-64 items-center justify-center rounded-full border-4 transition ${
            phase === 'detecting'
              ? 'border-neon-cyan animate-pulse bg-neon-cyan/10'
              : phase === 'paid'
                ? 'border-neon-green bg-neon-green/20'
                : 'border-gray-200 bg-kiosk-panel'
          }`}
        >
          {phase === 'idle' && (
            <>
              <Nfc className="h-20 w-20 text-neon-cyan" />
              <Radio className="absolute bottom-8 right-8 h-10 w-10 text-gray-500" />
            </>
          )}
          {phase === 'detecting' && (
            <p className="text-neon-cyan">{lang === 'vi' ? 'Đang nhận diện...' : 'Detecting device...'}</p>
          )}
          {phase === 'paid' && (
            <div>
              <p className="text-4xl">✓</p>
              <p className="mt-2 text-xl font-bold text-neon-green">
                {lang === 'vi' ? 'Đã thanh toán vé xe' : 'Fare paid'}
              </p>
              <p className="text-2xl font-bold">{fare.toLocaleString('vi-VN')}đ</p>
            </div>
          )}
        </div>

        {phase === 'idle' && (
          <button
            type="button"
            onClick={simulateBoarding}
            className="btn-kiosk mt-10 rounded-xl bg-neon-green px-10 py-4 text-lg font-bold text-white"
          >
            {lang === 'vi' ? 'Mô phỏng: Bước lên xe' : 'Simulate: Board bus'}
          </button>
        )}

        {phase === 'paid' && (
          <p className="mt-8 max-w-md rounded-lg border border-neon-green/40 bg-neon-green/5 p-4 text-neon-green">
            {lang === 'vi'
              ? 'Màn hình điện thoại chỉ sáng nhẹ — Không cần đưa tay lên quét mã khi lên bậc thang'
              : 'Phone screen lights up briefly — No scanning on moving bus stairs'}
          </p>
        )}

        <p className="mt-8 text-xs text-gray-500">
          Tuyến {route?.number} · HCI Solution C · Prototype
        </p>
      </div>
    </KioskLayout>
  )
}
