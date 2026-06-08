import { useMemo, useState } from 'react'
import {
  buildTripUrl,
  getScannableOrigin,
  isLocalOnlyOrigin,
  setStoredQrOrigin,
  type TripQuery,
} from '../../lib/tripUrl'

export function QrOriginSetup({
  lang,
  sampleQuery,
  onSaved,
}: {
  lang: 'vi' | 'en'
  sampleQuery: TripQuery
  onSaved?: () => void
}) {
  const isVi = lang === 'vi'
  const current = getScannableOrigin()
  const localOnly = isLocalOnlyOrigin(current)
  const [draft, setDraft] = useState(() =>
    localOnly ? '' : current.replace(/^https?:\/\//, ''),
  )
  const [saved, setSaved] = useState(false)

  const preview = useMemo(() => {
    if (!draft.trim()) return buildTripUrl(sampleQuery)
    const origin = draft.startsWith('http') ? draft.trim() : `http://${draft.trim()}`
    return buildTripUrl(sampleQuery, { origin })
  }, [draft, sampleQuery])

  if (!localOnly && !saved) return null

  return (
    <div className="mx-auto mb-4 w-full max-w-sm rounded-lg border border-warning-orange/50 bg-warning-orange/10 p-3 text-sm">
      <p className="font-semibold text-warning-orange">
        {isVi ? '⚠ Điện thoại không quét được localhost' : '⚠ Phones cannot open localhost QR'}
      </p>
      <p className="mt-1 text-xs text-gray-600">
        {isVi
          ? 'Nhập IP LAN của máy tính (cùng Wi-Fi). VD: 192.168.1.42:5173'
          : 'Enter this PC’s LAN IP (same Wi-Fi). e.g. 192.168.1.42:5173'}
      </p>
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => {
            setSaved(false)
            setDraft(e.target.value)
          }}
          placeholder="192.168.1.42:5173"
          className="min-w-0 flex-1 rounded-lg border border-kiosk-border px-3 py-2 text-xs outline-none focus:border-neon-green"
        />
        <button
          type="button"
          onClick={() => {
            const raw = draft.trim()
            if (!raw) return
            const origin = raw.startsWith('http') ? raw : `http://${raw}`
            setStoredQrOrigin(origin)
            setSaved(true)
            onSaved?.()
          }}
          className="shrink-0 rounded-lg bg-neon-green px-3 py-2 text-xs font-bold text-white"
        >
          {isVi ? 'Lưu' : 'Save'}
        </button>
      </div>
      {saved && (
        <p className="mt-2 text-xs text-neon-green">
          {isVi ? '✓ Đã cập nhật link QR' : '✓ QR link updated'}
        </p>
      )}
      <p className="mt-2 break-all text-[10px] text-gray-500">{preview}</p>
    </div>
  )
}
