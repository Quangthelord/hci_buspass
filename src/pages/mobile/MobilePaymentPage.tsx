import { Link } from 'react-router-dom'
import { PhoneFrame } from '../../components/PhoneFrame'
import { MobileShell } from '../../components/mobile/MobileShell'
import { useSyncTripFromUrl } from '../../hooks/useSyncTripFromUrl'
import { buildAppPath } from '../../lib/tripUrl'

/** Tính năng 4 — Thanh toán rảnh tay (Hình 4.4) */
export function MobilePaymentPage() {
  const { query, route, lang } = useSyncTripFromUrl()
  const isVi = lang === 'vi'
  const fare = route?.fare ?? 7000

  return (
    <MobileShell className="bg-[#1a1a2e]">
      <p className="px-4 pb-2 text-center text-sm text-warning-orange">📷 Hình 4.4 — Lock screen payment</p>
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
            <p className="mt-1 text-center text-sm text-gray-400">
              {isVi ? 'Tuyến' : 'Route'} {route?.number} · NFC/BLE
            </p>
          </div>
          <p className="absolute bottom-8 inset-x-4 text-center text-xs text-gray-500">
            {isVi ? 'Màn hình khóa sáng nhẹ — Hai tay bám vịn' : 'Lock screen glance — Hands on railing'}
          </p>
        </div>
      </PhoneFrame>
      {query && (
        <Link to={buildAppPath(query)} className="mt-6 block pb-8 text-center text-gray-400 underline">
          ← {isVi ? 'Về App hub' : 'Back to hub'}
        </Link>
      )}
    </MobileShell>
  )
}
