import { useState } from 'react'
import { Volume2 } from 'lucide-react'
import { useKiosk } from '../context/KioskContext'
import type { Lang } from '../data/mockData'

export function DirectionalAudioDemo({ routeNumber, lang }: { routeNumber: string; lang: Lang }) {
  const { speak } = useKiosk()
  const [played, setPlayed] = useState(false)

  const play = () => {
    const msg =
      lang === 'vi'
        ? `Tuyến ${routeNumber} của bạn đang vào trạm. Bạn không cần rút điện thoại.`
        : `Your route ${routeNumber} is approaching. You do not need to take out your phone.`
    speak(msg)
    setPlayed(true)
  }

  return (
    <div className="w-full max-w-lg rounded-xl border border-warning-orange/40 bg-warning-orange/5 p-6 text-left">
      <h3 className="mb-2 flex items-center gap-2 font-bold text-warning-orange">
        <Volume2 className="h-5 w-5" />
        {lang === 'vi' ? 'Loa hướng tính (Directional Audio)' : 'Directional audio'}
      </h3>
      <p className="mb-4 text-sm text-gray-500">
        {lang === 'vi'
          ? 'Omnichannel — Âm thanh chỉ tại ghế bạn ngồi (mô phỏng bằng TTS trong prototype)'
          : 'Omnichannel — Audio only at your seat (TTS simulation in prototype)'}
      </p>
      <button
        type="button"
        onClick={play}
        className="rounded-lg border border-warning-orange px-6 py-3 text-warning-orange hover:bg-warning-orange/10"
      >
        {lang === 'vi' ? '▶ Phát thông báo tại ghế' : '▶ Play seat alert'}
      </button>
      {played && (
        <p className="mt-3 text-sm text-neon-green">
          {lang === 'vi' ? '🔊 Đã phát — Giải pháp Rủi ro 3: an toàn ngoài đường' : '🔊 Played — Risk 3: street safety'}
        </p>
      )}
    </div>
  )
}
