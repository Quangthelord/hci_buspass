import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Map, Navigation } from 'lucide-react'
import { KioskLayout } from '../components/KioskLayout'
import { KioskNavBar } from '../components/KioskNavBar'
import { TransparencyEta } from '../components/TransparencyEta'
import { RouteCountdown } from '../components/RouteCountdown'
import { useKiosk } from '../context/KioskContext'
import { ROUTES } from '../data/mockData'
import { tr } from '../i18n/translations'

const PAGE_SIZE = 6

export function ListModePage() {
  const navigate = useNavigate()
  const { lang } = useKiosk()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'route' | 'dest' | 'street'>('all')
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return ROUTES.filter((r) => {
      if (!q) return true
      if (filter === 'route') return r.number.includes(q)
      if (filter === 'dest') return r.to.toLowerCase().includes(q) || r.from.toLowerCase().includes(q)
      return (
        r.number.includes(q) ||
        r.from.toLowerCase().includes(q) ||
        r.to.toLowerCase().includes(q) ||
        r.via.some((v) => v.toLowerCase().includes(q))
      )
    })
  }, [query, filter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const slice = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  return (
    <KioskLayout>
      <div className="kiosk-page-pad kiosk-scroll-pad flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-4 text-base lg:text-lg">
        <KioskNavBar
          backTo="/mode"
          className="mb-3"
          links={[
            { to: '/map', label: tr('switchMap', lang), icon: Map },
            { to: '/trip', label: lang === 'vi' ? 'A → B' : 'A → B', icon: Navigation },
          ]}
        />
        <header className="mb-4">
          <h1 className="text-3xl font-bold text-neon-cyan">📋 {tr('listTitle', lang)}</h1>
          <p className="text-warning-orange">[{tr('easyRead', lang)} — 200%]</p>
        </header>

        <div className="mb-4">
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(0)
            }}
            placeholder={`🔍 ${tr('searchPlaceholder', lang)}`}
            className="w-full rounded-xl border-2 border-kiosk-border bg-kiosk-bg px-5 py-4 text-xl outline-none focus:border-neon-cyan"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {(
              [
                ['all', lang === 'vi' ? 'TẤT CẢ' : 'ALL'],
                ['route', lang === 'vi' ? 'SỐ TUYẾN' : 'ROUTE #'],
                ['dest', lang === 'vi' ? 'ĐIỂM ĐẾN' : 'DESTINATION'],
                ['street', lang === 'vi' ? 'TÊN ĐƯỜNG' : 'STREET'],
              ] as const
            ).map(([f, label]) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-lg border px-4 py-2 text-base ${
                  filter === f ? 'border-neon-green bg-neon-green/10 text-neon-green' : 'border-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto lg:grid-cols-2 xl:grid-cols-3">
          {slice.map((r) => (
            <article
              key={r.id}
              className="rounded-2xl border-2 border-neon-green/40 bg-kiosk-panel p-5 neon-border lg:p-6"
            >
              <h2 className="text-3xl font-bold text-neon-green lg:text-4xl">TUYẾN {r.number}</h2>
              <hr className="my-3 border-kiosk-border" />
              <p className="text-xl">
                📍 {r.from} → {r.to}
              </p>
              <div className="my-3">
                <RouteCountdown routeNumber={r.number} etaRange={r.etaRange} lang={lang} large />
              </div>
              <TransparencyEta route={r} lang={lang} className="mb-3" />
              <button
                type="button"
                onClick={() => navigate('/route/' + r.id)}
                className="btn-kiosk mt-4 w-full rounded-xl border-2 border-neon-cyan py-4 text-xl font-bold text-neon-cyan hover:bg-neon-cyan/10"
              >
                {tr('viewDetail', lang)}
              </button>
            </article>
          ))}
        </div>

        <footer className="mt-4 flex items-center justify-between border-t border-kiosk-border pt-4">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border px-4 py-2 disabled:opacity-30"
          >
            ⬅️
          </button>
          <span className="text-lg">
            [{page + 1}] / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border px-4 py-2 disabled:opacity-30"
          >
            ➡️
          </button>
        </footer>

        <button
          type="button"
          onClick={() => navigate('/map')}
          className="fixed bottom-24 right-6 z-40 flex flex-col items-center rounded-full border-2 border-neon-green bg-white px-4 py-3 text-sm text-neon-green shadow-lg lg:bottom-8 lg:right-10"
        >
          <Map className="h-8 w-8" />
          <span>{tr('switchMap', lang)}</span>
        </button>
      </div>
    </KioskLayout>
  )
}
