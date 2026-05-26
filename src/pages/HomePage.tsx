import { useNavigate } from 'react-router-dom'
import { Headphones, Sparkles } from 'lucide-react'
import { KioskLayout } from '../components/KioskLayout'
import { useKiosk } from '../context/KioskContext'
import { STATION } from '../data/mockData'
import type { Lang } from '../data/mockData'
import { tr } from '../i18n/translations'

const LANGS: { code: Lang; label: string; flag: string; size: 'lg' | 'sm' }[] = [
  { code: 'vi', label: 'TIẾNG VIỆT', flag: '🇻🇳', size: 'lg' },
  { code: 'en', label: 'ENGLISH', flag: '🇬🇧', size: 'lg' },
  { code: 'zh', label: '中文', flag: '🇨🇳', size: 'sm' },
  { code: 'ko', label: '한국어', flag: '🇰🇷', size: 'sm' },
]

export function HomePage() {
  const navigate = useNavigate()
  const { setLang, welcomeKey } = useKiosk()

  const pick = (code: Lang) => {
    setLang(code)
    navigate('/mode')
  }

  return (
    <KioskLayout showHeader={true}>
      <div key={welcomeKey} className="kiosk-page-pad kiosk-scroll-pad welcome-animate px-6 py-6 lg:px-10">
        <section className="flex flex-1 flex-col items-center justify-center text-center lg:flex-row lg:items-center lg:gap-16 lg:text-left">
          <div className="lg:max-w-md lg:flex-1">
            <p className="mb-2 text-5xl lg:text-6xl">🚏</p>
            <h1 className="mb-2 text-3xl font-bold leading-tight text-neon-green md:text-4xl lg:text-[2.5rem]">
              {tr('welcomeTitle', 'vi')}
            </h1>
            <p className="mb-8 text-xl text-green-700 lg:mb-0">{tr('welcomeSub', 'en')}</p>
          </div>

          <div className="grid w-full max-w-xl grid-cols-2 gap-3 lg:max-w-none lg:flex-1 lg:grid-cols-2 lg:gap-4 xl:grid-cols-4">
            {LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => pick(l.code)}
                className={`btn-kiosk rounded-xl border-2 border-kiosk-border bg-white font-bold text-neon-green shadow-sm transition hover:border-neon-green hover:bg-neon-green hover:text-white ${
                  l.size === 'lg' ? 'py-6 text-xl lg:py-8 lg:text-2xl' : 'py-4 text-base lg:py-5 lg:text-lg'
                }`}
              >
                <span className="mr-2">{l.flag}</span>
                {l.label}
              </button>
            ))}
          </div>
        </section>

        <footer className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-kiosk-border pt-6 lg:mt-8">
          <p className="text-gray-500">
            {tr('routesAtStation', 'vi', { n: STATION.routeCount })}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/services')}
              className="btn-kiosk flex items-center gap-2 rounded-lg border border-kiosk-border bg-kiosk-panel px-5 py-3 text-neon-green transition hover:bg-neon-green hover:text-white"
            >
              <Sparkles className="h-5 w-5" />
              TIỆN ÍCH
            </button>
            <button
              type="button"
              onClick={() => navigate('/help')}
              className="btn-kiosk flex items-center gap-2 rounded-lg border border-neon-green bg-neon-green px-5 py-3 text-white transition hover:bg-green-700"
            >
              <Headphones className="h-5 w-5" />
              {tr('help', 'vi')}
            </button>
          </div>
        </footer>
      </div>
    </KioskLayout>
  )
}
