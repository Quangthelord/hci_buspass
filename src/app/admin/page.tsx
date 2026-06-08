import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  clearTelemetry,
  exportSessionData,
  exportSessionDataJson,
  getSummaryByVariant,
  getTotalSessions,
  getVariantSummary,
} from '../../lib/telemetry'
import {
  getKioskOrientation,
  setKioskOrientation,
  type KioskOrientation,
} from '../../lib/kioskDisplay'
import {
  getActiveVariant,
  setActiveVariant,
  VARIANTS,
  type VariantId,
} from '../../lib/variantConfig'
import { VARIANT_SDS } from '../../lib/variantSds'

const ADMIN_PIN = '2025'
const SDS_MAX = 7

function SdsBarChart({ variantId }: { variantId: VariantId }) {
  const dimensions = VARIANT_SDS[variantId]
  return (
    <div className="mt-3 space-y-1.5">
      {dimensions.map((d) => (
        <div key={d.key} className="flex items-center gap-2 text-xs">
          <span className="w-20 shrink-0 text-slate-400">{d.label}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-700">
            <div
              className="h-full rounded-full bg-cyan-400"
              style={{ width: `${(d.score / SDS_MAX) * 100}%` }}
            />
          </div>
          <span className="w-8 text-right tabular-nums text-slate-300">{d.score}</span>
        </div>
      ))}
    </div>
  )
}

export default function AdminPage() {
  const navigate = useNavigate()
  const [pin, setPin] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [orientation, setOrientation] = useState<KioskOrientation>(getKioskOrientation)

  const activeVariant = getActiveVariant()
  const totalSessions = useMemo(() => getTotalSessions(), [unlocked, refreshKey])
  const summaries = useMemo(() => {
    const live = getSummaryByVariant()
    return VARIANTS.map((v) => ({
      ...v,
      stats: live.find((s) => s.variantId === v.id) ?? getVariantSummary(v.id),
      isActive: activeVariant === v.id || (!activeVariant && v.id === 'Variant_6_BusPassSignature'),
    }))
  }, [unlocked, refreshKey, activeVariant])

  const tryUnlock = () => {
    if (pin === ADMIN_PIN) {
      setUnlocked(true)
      setError('')
    } else {
      setError('Mã PIN không đúng')
    }
  }

  const selectVariant = (id: VariantId) => {
    setActiveVariant(id)
    navigate('/')
  }

  const downloadCsv = () => {
    const blob = new Blob([exportSessionData()], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `buspass-telemetry-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!unlocked) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-950 p-6 text-white">
        <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
          <h1 className="mb-1 text-xl font-bold text-cyan-400">BusPass Admin</h1>
          <p className="mb-4 text-sm text-slate-400">Chỉ dành cho điều phối viên test</p>
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && tryUnlock()}
            placeholder="Nhập PIN"
            className="mb-3 w-full rounded-lg border border-slate-600 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500"
          />
          {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
          <button
            type="button"
            onClick={tryUnlock}
            className="w-full rounded-lg bg-cyan-600 py-3 font-semibold text-white hover:bg-cyan-500"
          >
            Mở khóa
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-slate-950 p-6 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">BusPass Test Admin</h1>
            <p className="text-sm text-slate-400">Variant switcher & telemetry dashboard</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setRefreshKey((k) => k + 1)}
              className="rounded-lg border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800"
            >
              Làm mới
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="rounded-lg border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800"
            >
              Về kiosk
            </button>
          </div>
        </header>

        {/* Display settings */}
        <section className="mb-6 rounded-2xl border border-slate-700 bg-slate-900 p-5">
          <h2 className="mb-3 text-lg font-bold text-cyan-400">Kiosk hiển thị</h2>
          <p className="mb-3 text-sm text-slate-400">
            Khung mô phỏng kiosk — 1080×1920 dọc hoặc 1920×1080 ngang
          </p>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: 'portrait' as const, label: 'Dọc 1080×1920' },
                { id: 'landscape' as const, label: 'Ngang 1920×1080' },
              ] as const
            ).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setKioskOrientation(o.id)
                  setOrientation(o.id)
                }}
                className={`rounded-lg px-4 py-2 text-sm font-medium ${
                  orientation === o.id
                    ? 'bg-cyan-600 text-white'
                    : 'border border-slate-600 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </section>

        {/* Session stats */}
        <section className="mb-8 rounded-2xl border border-slate-700 bg-slate-900 p-5">
          <h2 className="mb-4 text-lg font-bold text-cyan-400">Phiên hiện tại</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-slate-800 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Tổng phiên</p>
              <p className="mt-1 text-3xl font-bold tabular-nums">{totalSessions}</p>
            </div>
            {summaries
              .filter((s) => s.stats.sessionCount > 0)
              .slice(0, 6)
              .map((s) => (
                <div key={s.id} className="rounded-xl bg-slate-800 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">{s.label}</p>
                  <p className="mt-1 text-sm text-slate-300">
                    {(s.stats.avgDurationMs / 1000).toFixed(1)}s avg ·{' '}
                    {(s.stats.successRate * 100).toFixed(0)}% success
                  </p>
                </div>
              ))}
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="py-2 pr-4">Variant</th>
                  <th className="py-2 pr-4">Phiên</th>
                  <th className="py-2 pr-4">TG hoàn thành TB</th>
                  <th className="py-2 pr-4">Tỷ lệ thành công</th>
                  <th className="py-2 pr-4">Misclick</th>
                  <th className="py-2">Senior mode</th>
                </tr>
              </thead>
              <tbody>
                {summaries.map((s) => (
                  <tr key={s.id} className="border-b border-slate-800">
                    <td className="py-2.5 pr-4 font-medium">{s.label}</td>
                    <td className="py-2.5 pr-4 tabular-nums">{s.stats.sessionCount}</td>
                    <td className="py-2.5 pr-4 tabular-nums">
                      {(s.stats.avgDurationMs / 1000).toFixed(1)}s
                    </td>
                    <td className="py-2.5 pr-4 tabular-nums">
                      {(s.stats.successRate * 100).toFixed(0)}%
                    </td>
                    <td className="py-2.5 pr-4 tabular-nums">
                      {(s.stats.misclickRate * 100).toFixed(0)}%
                    </td>
                    <td className="py-2.5 tabular-nums">
                      {(s.stats.seniorModeRate * 100).toFixed(0)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={downloadCsv}
              className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500"
            >
              Xuất dữ liệu CSV
            </button>
            <button
              type="button"
              onClick={() => {
                const blob = new Blob([exportSessionDataJson()], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `buspass-telemetry-${Date.now()}.json`
                a.click()
                URL.revokeObjectURL(url)
              }}
              className="rounded-lg border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800"
            >
              Export JSON
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm('Xóa toàn bộ telemetry?')) {
                  clearTelemetry()
                  setRefreshKey((k) => k + 1)
                }
              }}
              className="rounded-lg border border-red-800 px-4 py-2 text-sm text-red-400 hover:bg-red-950"
            >
              Xóa dữ liệu
            </button>
          </div>
        </section>

        {/* Variant cards */}
        <h2 className="mb-4 text-lg font-bold text-white">Chọn variant cho phiên test</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {summaries.map((v) => (
            <article
              key={v.id}
              className={`rounded-2xl border p-5 transition ${
                v.isActive
                  ? 'border-cyan-500 bg-slate-900 ring-1 ring-cyan-500/30'
                  : 'border-slate-700 bg-slate-900 hover:border-slate-500'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-cyan-400">{v.label}</p>
                  <p className="mt-1 text-sm text-slate-400">{v.description}</p>
                </div>
                {v.isActive && (
                  <span className="shrink-0 rounded-full bg-cyan-900 px-2 py-0.5 text-xs text-cyan-300">
                    Đang dùng
                  </span>
                )}
              </div>

              <SdsBarChart variantId={v.id} />

              <p className="mt-3 font-mono text-xs text-slate-500">{v.id}</p>

              <button
                type="button"
                onClick={() => selectVariant(v.id)}
                className="mt-4 w-full rounded-lg bg-slate-800 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700"
              >
                Chọn variant này
              </button>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
