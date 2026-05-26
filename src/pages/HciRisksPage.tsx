import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'
import { KioskLayout } from '../components/KioskLayout'
import { useKiosk } from '../context/KioskContext'

const RISKS = [
  {
    id: 1,
    titleVi: 'Phá hoại / bôi bẩn màn cảm ứng',
    titleEn: 'Touchscreen vandalism & dirt',
    riskVi: 'Màn hình cảm ứng ngoài trời dễ vẽ bậy, đập phá, dính bụi → liệt cảm ứng.',
    riskEn: 'Outdoor touchscreens get vandalized or dirty → unusable.',
    solutionVi: 'Nút kim loại chống phá hoại + Remote UI (điện thoại điều khiển sau QR).',
    solutionEn: 'Anti-vandal metal buttons + Remote UI via phone after QR scan.',
    demoPath: '/eink',
    demoLabelVi: 'Xem chế độ E-ink + nút vật lý',
    demoLabelEn: 'See E-ink + physical keys',
  },
  {
    id: 2,
    titleVi: 'Sai lệch ETA — Mất tin hệ thống',
    titleEn: 'ETA drift — System distrust',
    riskVi: 'Báo 2 phút nhưng kẹt xe 10 phút → người dùng không còn tin.',
    riskEn: 'Says 2 min but stuck in traffic 10 min → total distrust.',
    solutionVi: 'Minh bạch sai số: khoảng 2–5 phút + lý do kẹt + xe trên bản đồ thật.',
    solutionEn: 'Transparency: 2–5 min range + congestion reason + live map dot.',
    demoPath: '/map',
    demoLabelVi: 'Xem bản đồ + ETA minh bạch',
    demoLabelEn: 'See map + transparent ETA',
  },
  {
    id: 3,
    titleVi: 'An toàn & riêng tư ngoài đường',
    titleEn: 'Street safety & privacy',
    riskVi: 'Cầm điện thoại tại trạm → nguy cơ cướp giật, làm rơi máy.',
    riskEn: 'Holding phone at stop → snatch theft, drops.',
    solutionVi: 'Omnichannel: rung trong túi + loa hướng tính tại ghế — không cần rút máy.',
    solutionEn: 'Omnichannel: pocket haptics + directional seat audio — phone stays away.',
    demoPath: '/qr',
    demoLabelVi: 'Xem haptic + loa ghế',
    demoLabelEn: 'See haptic + seat audio',
  },
]

export function HciRisksPage() {
  const navigate = useNavigate()
  const { lang } = useKiosk()
  const [open, setOpen] = useState<number | null>(1)
  const isVi = lang === 'vi'

  return (
    <KioskLayout scrollable>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-8 py-6">
        <button type="button" onClick={() => navigate('/mode')} className="mb-4 flex items-center gap-2 text-gray-500">
          <ArrowLeft className="h-5 w-5" />
          {isVi ? 'Quay lại' : 'Back'}
        </button>

        <h1 className="mb-2 text-3xl font-bold text-neon-cyan">
          {isVi ? 'Phản biện rủi ro HCI' : 'HCI Risk Critique'}
        </h1>
        <p className="mb-8 text-gray-500">
          {isVi ? 'Trạm xe buýt ngoài trời — Rủi ro & giải pháp thiết kế' : 'Outdoor bus stop — Risks & design responses'}
        </p>

        <div className="space-y-4">
          {RISKS.map((r) => (
            <article key={r.id} className="rounded-2xl border border-kiosk-border bg-kiosk-panel">
              <button
                type="button"
                onClick={() => setOpen(open === r.id ? null : r.id)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <h2 className="text-xl font-bold">
                  {r.id}. {isVi ? r.titleVi : r.titleEn}
                </h2>
                {open === r.id ? <ChevronUp /> : <ChevronDown />}
              </button>
              {open === r.id && (
                <div className="border-t border-kiosk-border px-6 pb-6">
                  <p className="mt-4 font-semibold text-red-400">{isVi ? 'Rủi ro' : 'Risk'}</p>
                  <p className="text-gray-600">{isVi ? r.riskVi : r.riskEn}</p>
                  <p className="mt-4 font-semibold text-neon-green">{isVi ? 'Giải pháp HCI' : 'HCI solution'}</p>
                  <p className="text-gray-600">{isVi ? r.solutionVi : r.solutionEn}</p>
                  <button
                    type="button"
                    onClick={() => navigate(r.demoPath)}
                    className="mt-4 rounded-lg border border-neon-cyan px-4 py-2 text-neon-cyan"
                  >
                    → {isVi ? r.demoLabelVi : r.demoLabelEn}
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </KioskLayout>
  )
}
