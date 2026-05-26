import { useNavigate } from 'react-router-dom'
import { PhoneFrame } from '../../components/PhoneFrame'
import { useKiosk } from '../../context/KioskContext'
import { getRoute } from '../../data/mockData'

/** Tính năng 4 — Thanh toán rảnh tay (Hình 4.4) */
export function MobilePaymentPage() {
  const navigate = useNavigate()
  const { lang, selectedRouteId } = useKiosk()
  const route = getRoute(selectedRouteId ?? '19')
  const isVi = lang === 'vi'
  const fare = route?.fare ?? 7000

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#1a1a2e] p-8">
      <p className="mb-4 text-sm text-warning-orange">📷 Hình 4.4 — Lock screen payment</p>
      <PhoneFrame>
        <div className="relative min-h-[520px] bg-gradient-to-b from-slate-900 to-black p-4">
          <p className="mt-12 text-center text-5xl font-light text-white/30">09:41</p>
          <p className="text-center text-sm text-white/40">Tuesday, May 26</p>
          <div className="absolute inset-x-4 bottom-24 rounded-2xl border border-neon-green/50 bg-neon-green/15 p-5 backdrop-blur">
            <p className="text-center text-2xl">✓</p>
            <p className="mt-2 text-center text-lg font-bold text-neon-green">
              {isVi ? 'Thanh toán thành công' : 'Payment successful'}
            </p>
            <p className="text-center text-2xl font-bold text-white">
              {fare.toLocaleString('vi-VN')}đ
            </p>
            <p className="mt-1 text-center text-sm text-gray-600">
              {isVi ? 'Tuyến' : 'Route'} {route?.number} · NFC/BLE
            </p>
          </div>
          <p className="absolute bottom-8 inset-x-4 text-center text-xs text-gray-500">
            {isVi ? 'Màn hình khóa sáng nhẹ — Hai tay bám vịn' : 'Lock screen glance — Hands on railing'}
          </p>
        </div>
      </PhoneFrame>
      <button type="button" onClick={() => navigate('/app')} className="mt-6 text-gray-500 underline">
        ← {isVi ? 'Về App hub' : 'Back to hub'}
      </button>
    </div>
  )
}
