import { useNavigate } from 'react-router-dom'
import { List, Map, Navigation } from 'lucide-react'
import { ProductLayerTag } from '../components/ProductLayerTag'
import { KioskLayout } from '../components/KioskLayout'
import { KioskNavBar } from '../components/KioskNavBar'
import { useKiosk } from '../context/KioskContext'
import { tr } from '../i18n/translations'

export function ModeSelectionPage() {
  const navigate = useNavigate()
  const { lang } = useKiosk()

  return (
    <KioskLayout>
      <div className="kiosk-page-pad kiosk-scroll-pad px-6 py-6 lg:px-10">
        <KioskNavBar backTo="/kiosk" showHome={false} className="mb-4" />
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-neon-green neon-text">{tr('modeQuestion', lang)}</h1>
          <p className="mt-2 text-lg text-gray-500">{tr('modeQuestionSub', lang)}</p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/trip')}
          className="btn-kiosk mb-6 flex w-full items-center justify-between rounded-2xl border-2 border-neon-green bg-neon-green/10 px-8 py-6 text-left transition hover:bg-neon-green/20 neon-border"
        >
          <div>
            <div className="mb-2 flex items-center gap-2">
              <ProductLayerTag layer="decision" lang={lang} />
              <span className="text-xs text-neon-green">{lang === 'vi' ? 'Đề xuất' : 'Recommended'}</span>
            </div>
            <p className="text-2xl font-bold text-neon-green">
              {lang === 'vi' ? 'Tôi muốn đi từ A → B' : 'I want to go from A → B'}
            </p>
            <p className="text-gray-500">
              {lang === 'vi' ? 'Gợi ý nhanh / rẻ / ít đổi tuyến' : 'Fastest / cheapest / fewest transfers'}
            </p>
          </div>
          <Navigation className="h-14 w-14 text-neon-green" />
        </button>

        <p className="mb-3 text-center text-sm text-gray-500">
          {lang === 'vi' ? 'Hoặc chọn cách xem thông tin' : 'Or choose how to browse'}
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
          <ModeCard
            icon={<Map className="h-16 w-16 text-neon-green" />}
            title={tr('mapMode', lang)}
            subtitle="Visual Map Mode"
            badge={tr('recommended', lang)}
            benefits={[
              lang === 'vi' ? 'Nhìn thấy vị trí xe thời gian thực' : 'Real-time bus positions',
              lang === 'vi' ? 'Đường chỉ dẫn màu sắc rõ ràng' : 'Color-coded directions',
              lang === 'vi' ? 'Phù hợp người trẻ, du khách' : 'For youth & tourists',
            ]}
            accent="green"
            lang={lang}
            onSelect={() => navigate('/map')}
          />
          <ModeCard
            icon={<List className="h-16 w-16 text-green-700" />}
            title={tr('listMode', lang)}
            subtitle="List Mode"
            benefits={[
              lang === 'vi' ? 'Danh sách số xe rõ ràng' : 'Clear route numbers',
              lang === 'vi' ? 'Chữ lớn, dễ đọc' : 'Large, readable text',
              lang === 'vi' ? 'Phù hợp người lớn tuổi' : 'Senior-friendly',
            ]}
            accent="cyan"
            lang={lang}
            onSelect={() => navigate('/list')}
          />
        </div>

        <footer className="mt-6 text-center">
          <p className="text-sm text-gray-500">💡 {tr('modeTip', lang)}</p>
        </footer>
      </div>
    </KioskLayout>
  )
}

function ModeCard({
  icon,
  title,
  subtitle,
  badge,
  benefits,
  accent,
  lang,
  onSelect,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  badge?: string
  benefits: string[]
  accent: 'green' | 'cyan'
  lang: import('../data/mockData').Lang
  onSelect: () => void
}) {
  const border =
    accent === 'green'
      ? 'border-neon-green/50 hover:border-neon-green'
      : 'border-green-400/50 hover:border-green-600'
  const btn = accent === 'green' ? 'bg-neon-green text-white' : 'bg-green-700 text-white'

  return (
    <div className={`flex flex-col rounded-2xl border-2 ${border} bg-kiosk-panel p-6 transition`}>
      {badge && (
        <span className="mb-3 w-fit rounded-full bg-neon-green/20 px-3 py-1 text-xs font-bold text-neon-green">
          ★ {badge}
        </span>
      )}
      <div className="mb-4 flex justify-center">{icon}</div>
      <h2 className="text-center text-2xl font-bold">{title}</h2>
      <p className="mb-4 text-center text-gray-500">{subtitle}</p>
      <div className="mb-4 flex-1 rounded-lg border border-dashed border-gray-200 bg-kiosk-bg/50 p-4">
        <div className="grid-bg h-24 rounded opacity-60" />
      </div>
      <ul className="mb-6 space-y-2 text-sm text-gray-600">
        {benefits.map((b) => (
          <li key={b}>✓ {b}</li>
        ))}
      </ul>
      <button type="button" onClick={onSelect} className={`btn-kiosk w-full rounded-xl py-4 text-lg font-bold ${btn}`}>
        {tr('selectMode', lang)}
      </button>
    </div>
  )
}
