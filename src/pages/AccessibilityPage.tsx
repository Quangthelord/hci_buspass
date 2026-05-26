import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mic, Volume2 } from 'lucide-react'
import { KioskLayout } from '../components/KioskLayout'
import { KioskNavBar } from '../components/KioskNavBar'
import { useKiosk } from '../context/KioskContext'
import { DESTINATIONS } from '../data/mockData'
import { tr } from '../i18n/translations'

export function AccessibilityPage() {
  const navigate = useNavigate()
  const { lang, a11y, setA11y, speak, setDestination } = useKiosk()
  const [listening, setListening] = useState(false)
  const [heard, setHeard] = useState('')

  useEffect(() => {
    if (!listening) return
    const SR =
      window.SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognition }).webkitSpeechRecognition
    if (!SR) {
      setHeard(lang === 'vi' ? 'Trình duyệt không hỗ trợ nhận diện giọng nói' : 'Speech recognition not supported')
      setListening(false)
      return
    }
    const rec = new SR()
    rec.lang = lang === 'vi' ? 'vi-VN' : 'en-US'
    rec.onresult = (e: SpeechRecognitionEvent) => {
      const text = e.results[0][0].transcript
      setHeard(text)
      setListening(false)
      const match = DESTINATIONS.find(
        (d) =>
          text.toLowerCase().includes(d.nameVi.toLowerCase()) ||
          text.toLowerCase().includes(d.nameEn.toLowerCase()),
      )
      if (match) {
        setDestination(match)
        speak(lang === 'vi' ? `Đang tìm đường đến ${match.nameVi}` : `Routing to ${match.nameEn}`)
        navigate('/map')
      }
    }
    rec.onerror = () => setListening(false)
    rec.start()
    return () => rec.abort()
  }, [listening, lang, navigate, setDestination, speak])

  const examples =
    lang === 'vi'
      ? ['Tôi muốn đi Chợ Bến Thành', 'Xe nào đi Sân bay?', 'Tuyến 19 còn bao lâu nữa?']
      : ['I want to go to Ben Thanh Market', 'Which bus goes to the airport?', 'How long for route 19?']

  return (
    <KioskLayout scrollable>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-8 py-6">
        <KioskNavBar backTo="history" className="mb-4" />
        <h1 className="mb-6 text-3xl font-bold">♿ {tr('a11yTitle', lang)}</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <ToggleCard
            title={tr('highContrast', lang)}
            enabled={a11y.highContrast}
            onToggle={() => setA11y({ highContrast: !a11y.highContrast })}
          />
          <ToggleCard
            title={lang === 'vi' ? 'Chữ lớn (150%)' : 'Large text (150%)'}
            enabled={a11y.largeText}
            onToggle={() => setA11y({ largeText: !a11y.largeText })}
          />
          <ToggleCard
            title={tr('screenReader', lang)}
            enabled={a11y.screenReader}
            onToggle={() => {
              const next = !a11y.screenReader
              setA11y({ screenReader: next })
              if (next) speak(tr('a11yTitle', lang))
            }}
            icon={<Volume2 />}
          />

          <div className="rounded-2xl border border-kiosk-border bg-kiosk-panel p-6 md:col-span-2">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
              <Mic className="h-6 w-6 text-neon-cyan" />
              {tr('voiceNav', lang)}
            </h2>
            <button
              type="button"
              onClick={() => {
                setA11y({ voiceActive: true })
                setListening(true)
                setHeard('')
              }}
              className={`mx-auto flex h-40 w-full max-w-md flex-col items-center justify-center rounded-xl border-2 ${
                listening ? 'border-neon-cyan animate-pulse bg-neon-cyan/10' : 'border-kiosk-border'
              }`}
            >
              <div className="mb-4 flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-2 rounded-full bg-neon-cyan"
                    style={{ height: listening ? 12 + Math.random() * 24 : 8 }}
                  />
                ))}
              </div>
              <p className="text-lg text-neon-cyan">{tr('voicePrompt', lang)}</p>
            </button>
            {heard && <p className="mt-4 text-center text-warning-orange">🗣️ "{heard}"</p>}
            <div className="mt-6">
              <p className="mb-2 text-sm text-gray-500">{lang === 'vi' ? 'VÍ DỤ' : 'EXAMPLES'}:</p>
              {examples.map((ex) => (
                <p key={ex} className="text-gray-600">
                  🗣️ "{ex}"
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-kiosk-border bg-kiosk-panel p-6 md:col-span-2">
            <h2 className="mb-4 text-xl font-bold">{tr('magnifier', lang)}</h2>
            <div className="flex flex-wrap gap-3">
              {([100, 200, 300, 400] as const).map((z) => (
                <button
                  key={z}
                  type="button"
                  onClick={() => setA11y({ magnifier: z })}
                  className={`rounded-lg border px-6 py-3 ${
                    a11y.magnifier === z ? 'border-neon-green bg-neon-green/20' : 'border-gray-200'
                  }`}
                >
                  {z}%
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </KioskLayout>
  )
}

function ToggleCard({
  title,
  enabled,
  onToggle,
  icon,
}: {
  title: string
  enabled: boolean
  onToggle: () => void
  icon?: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`rounded-2xl border-2 p-6 text-left transition ${
        enabled ? 'border-neon-green bg-neon-green/10' : 'border-kiosk-border bg-kiosk-panel'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold">{title}</span>
        {icon}
        <span
          className={`h-8 w-14 rounded-full ${enabled ? 'bg-neon-green' : 'bg-gray-200'} relative`}
        >
          <span
            className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${enabled ? 'left-7' : 'left-1'}`}
          />
        </span>
      </div>
    </button>
  )
}
