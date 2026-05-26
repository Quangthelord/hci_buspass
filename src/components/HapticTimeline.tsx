import { useState } from 'react'
import { Smartphone, Vibrate } from 'lucide-react'
import type { Lang } from '../data/mockData'

type Phase = 'idle' | '500m' | 'arriving'

const PATTERNS: Record<Phase, number[]> = {
  idle: [],
  '500m': [80, 120, 80, 120, 80],
  arriving: [200, 100, 200, 100, 200, 100, 200],
}

export function HapticTimeline({ lang, routeNumber }: { lang: Lang; routeNumber: string }) {
  const [phase, setPhase] = useState<Phase>('idle')

  const trigger = (p: Phase) => {
    setPhase(p)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(PATTERNS[p])
    }
  }

  const steps = [
    {
      id: '500m' as const,
      title: lang === 'vi' ? 'Xe cách ~500m' : '~500m away',
      desc: lang === 'vi' ? 'Rung nhẹ, nhịp đều' : 'Gentle rhythmic pulse',
    },
    {
      id: 'arriving' as const,
      title: lang === 'vi' ? 'Xe tấp lề' : 'Pulling in',
      desc: lang === 'vi' ? 'Rung mạnh liên tục' : 'Strong continuous vibration',
    },
  ]

  return (
    <div className="w-full max-w-lg rounded-xl border border-neon-cyan/40 bg-kiosk-panel p-6 text-left">
      <h3 className="mb-4 flex items-center gap-2 font-bold text-neon-cyan">
        <Vibrate className="h-5 w-5" />
        {lang === 'vi' ? 'Phản hồi xúc giác (Haptic)' : 'Haptic feedback'}
      </h3>
      <p className="mb-4 text-sm text-gray-500">
        {lang === 'vi'
          ? `Tuyến ${routeNumber} — Điện thoại trong túi, không cần nhìn màn hình`
          : `Route ${routeNumber} — Phone in pocket, no need to watch the screen`}
      </p>
      <div className="space-y-3">
        {steps.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => trigger(s.id)}
            className={`w-full rounded-lg border p-4 text-left transition ${
              phase === s.id
                ? 'border-neon-green bg-neon-green/10'
                : 'border-kiosk-border hover:border-neon-cyan'
            }`}
          >
            <p className="font-semibold">{s.title}</p>
            <p className="text-sm text-gray-500">{s.desc}</p>
          </button>
        ))}
      </div>
      {phase !== 'idle' && (
        <div className="mt-4 flex items-center justify-center gap-2 text-neon-green animate-pulse">
          <Smartphone className="h-6 w-6" />
          <span>{lang === 'vi' ? 'Đang mô phỏng rung...' : 'Simulating vibration...'}</span>
        </div>
      )}
    </div>
  )
}
