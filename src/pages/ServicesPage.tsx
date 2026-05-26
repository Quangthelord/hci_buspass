import { useNavigate } from 'react-router-dom'
import { BatteryCharging, Coffee, Gift, Phone, Wifi } from 'lucide-react'
import { KioskLayout } from '../components/KioskLayout'
import { KioskNavBar } from '../components/KioskNavBar'
import { ProductLayerTag } from '../components/ProductLayerTag'
import { useKiosk } from '../context/KioskContext'
import { tr } from '../i18n/translations'

const AMENITIES = [
  { icon: BatteryCharging, titleVi: 'Sạc điện thoại', titleEn: 'Phone charging', descVi: 'USB-C & wireless tại kiosk', descEn: 'USB-C & wireless at kiosk' },
  { icon: Wifi, titleVi: 'WiFi miễn phí', titleEn: 'Free WiFi', descVi: 'BusPass_Station — không mật khẩu', descEn: 'BusPass_Station — no password' },
  { icon: Gift, titleVi: 'Tích điểm QR', titleEn: 'QR loyalty', descVi: 'Quét để nhận ưu đãi đối tác', descEn: 'Scan for partner deals' },
  { icon: Coffee, titleVi: 'Quán ăn gần trạm', titleEn: 'Food nearby', descVi: 'Gợi ý trong bán kính 200m', descEn: 'Suggestions within 200m' },
]

export function ServicesPage() {
  const navigate = useNavigate()
  const { lang } = useKiosk()
  const isVi = lang === 'vi'

  return (
    <KioskLayout>
      <div className="flex min-h-0 flex-1 flex-col px-8 py-6">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <KioskNavBar backTo="/" homeTo="/mode" className="mb-0 border-0 pb-0" />
          <ProductLayerTag layer="assistance" lang={lang} />
        </div>

        <h1 className="text-3xl font-bold text-warning-orange">
          {isVi ? 'TIỆN ÍCH TẠI TRẠM' : 'STATION AMENITIES'}
        </h1>
        <p className="mb-8 text-gray-500">
          {isVi ? 'Hơn cả bảng thông tin — trải nghiệm chờ xe thoải mái' : 'More than a sign — comfort while you wait'}
        </p>

        <div className="grid flex-1 grid-cols-2 gap-4">
          {AMENITIES.map((item) => (
            <div
              key={item.titleEn}
              className="flex flex-col rounded-2xl border border-kiosk-border bg-kiosk-panel p-6"
            >
              <item.icon className="mb-4 h-12 w-12 text-neon-green" />
              <h2 className="text-xl font-bold">{isVi ? item.titleVi : item.titleEn}</h2>
              <p className="mt-2 text-gray-500">{isVi ? item.descVi : item.descEn}</p>
              <span className="mt-auto pt-4 text-xs text-neon-cyan">
                {isVi ? 'Prototype — demo' : 'Prototype demo'}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-neon-cyan/40 bg-neon-cyan/5 p-6">
          <h3 className="mb-2 flex items-center gap-2 font-bold text-neon-cyan">
            <Phone className="h-5 w-5" />
            {isVi ? 'Hỗ trợ nhanh' : 'Quick support'}
          </h3>
          <p className="text-lg">📞 1900-xxxx · {isVi ? 'Nhấn gọi trên màn hình cảm ứng' : 'Tap to call on touchscreen'}</p>
          <button
            type="button"
            onClick={() => navigate('/help')}
            className="mt-4 rounded-lg border border-neon-cyan px-6 py-3 text-neon-cyan"
          >
            {tr('helpCenter', lang)}
          </button>
        </div>
      </div>
    </KioskLayout>
  )
}
