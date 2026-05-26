import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { KioskLayout } from '../components/KioskLayout'
import { KioskNavBar } from '../components/KioskNavBar'
import { useKiosk } from '../context/KioskContext'
import { HELP_CATEGORIES, HELP_CONTENT, HELP_TITLES, tr } from '../i18n/translations'

export function HelpPage() {
  const navigate = useNavigate()
  const { lang } = useKiosk()
  const [active, setActive] = useState<string | null>(null)

  const content = active ? HELP_CONTENT[active]?.[lang] : null

  return (
    <KioskLayout scrollable>
      <div className="flex min-h-0 flex-1 flex-col px-8 py-6">
        <KioskNavBar
          className="mb-4"
          onBack={() => (active ? setActive(null) : navigate('/'))}
          homeTo="/mode"
        />
        <div className="mb-6 flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-neon-cyan">❓ {tr('helpCenter', lang)}</h1>
            <p className="text-gray-500">{tr('helpSubtitle', lang)}</p>
          </div>
        </div>

        {!active ? (
          <div className="grid min-h-0 flex-1 grid-cols-3 grid-rows-2 gap-4">
            {HELP_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActive(cat.id)}
                className="flex flex-col items-center justify-center rounded-2xl border-2 border-kiosk-border bg-kiosk-panel p-6 transition hover:border-neon-cyan"
              >
                <span className="mb-3 text-5xl">{cat.icon}</span>
                <p className="mb-4 text-center text-lg font-semibold">{HELP_TITLES[cat.id]?.[lang]}</p>
                <span className="rounded-lg border border-neon-cyan px-4 py-2 text-sm text-neon-cyan">
                  {tr('viewGuide', lang)}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-kiosk-border bg-kiosk-panel p-8">
            <h2 className="mb-6 text-2xl font-bold text-neon-green">{HELP_TITLES[active]?.[lang]}</h2>
            <div className="mb-6 flex h-40 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-kiosk-bg">
              <p className="text-gray-500">▶ Video hướng dẫn (30–60s) — prototype placeholder</p>
            </div>
            <h3 className="mb-3 font-bold">{lang === 'vi' ? 'Các bước' : 'Steps'}</h3>
            <ol className="mb-8 list-decimal space-y-2 pl-6">
              {content?.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <h3 className="mb-3 font-bold">FAQ</h3>
            <dl className="space-y-4">
              {content?.faq.map((item, i) => (
                <div key={i} className={i % 2 === 0 ? 'font-semibold text-neon-cyan' : 'text-gray-600'}>
                  {item}
                </div>
              ))}
            </dl>
          </div>
        )}

        <footer className="mt-6 border-t border-kiosk-border pt-4 text-center text-gray-500">
          <p>📞 1900-xxxx · 📧 support@buspass.vn · 🌐 www.buspass.vn</p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn-kiosk mt-4 rounded-lg border border-neon-green px-6 py-3 text-neon-green"
          >
            {tr('backHome', lang)}
          </button>
        </footer>
      </div>
    </KioskLayout>
  )
}
