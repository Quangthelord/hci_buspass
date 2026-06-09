import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Headphones, List, Map, Menu, Volume2, X } from 'lucide-react'
import { useKiosk } from '../../context/KioskContext'
import { useKioskPaneEl } from '../../hooks/useKioskPaneEl'
import { tr } from '../../i18n/translations'
import type { BpLang, BpScreen } from './constants'

export type BpTextSize = 'small' | 'normal' | 'large'

function speakWithLang(text: string, lang: BpLang) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = lang === 'vi' ? 'vi-VN' : 'en-US'
  window.speechSynthesis.speak(u)
}

function MenuToggle({
  label,
  description,
  checked,
  onChange,
  icon,
}: {
  label: string
  description?: string
  checked: boolean
  onChange: (next: boolean) => void
  icon?: ReactNode
}) {
  return (
    <label className="bp-menu-toggle flex cursor-pointer items-center justify-between gap-3 rounded-xl border-2 border-kiosk-border bg-white px-3.5 py-3">
      <span className="flex min-w-0 items-center gap-2.5">
        {icon && <span className="shrink-0 text-neon-green">{icon}</span>}
        <span className="min-w-0">
          <span className="block font-semibold leading-tight">{label}</span>
          {description && (
            <span className="mt-0.5 block text-[var(--bp-caption,0.8125rem)] text-gray-500">{description}</span>
          )}
        </span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 shrink-0 accent-neon-green"
      />
    </label>
  )
}

export function BpInteractionMenu({
  lang,
  screen,
  onHelp,
  onList,
  onMap,
  onTrack,
}: {
  lang: BpLang
  screen: BpScreen
  onHelp: () => void
  onList: () => void
  onMap: () => void
  onTrack?: (target: string) => void
}) {
  const { a11y, setA11y } = useKiosk()
  const kioskPane = useKioskPaneEl()
  const [open, setOpen] = useState(false)
  const [textSize, setTextSize] = useState<BpTextSize>(() =>
    a11y.largeText ? 'large' : 'normal',
  )

  const isVi = lang === 'vi'
  const title = isVi ? 'Tùy chọn tương tác' : 'Interaction options'
  const menuLabel = isVi ? 'Mở menu tùy chọn' : 'Open options menu'

  useEffect(() => {
    document.body.classList.toggle('a11y-compact-text', textSize === 'small')
    setA11y({ largeText: textSize === 'large' })
  }, [textSize, setA11y])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const track = (target: string) => onTrack?.(target)

  const applyTextSize = (size: BpTextSize) => {
    setTextSize(size)
    track(`menu-text-${size}`)
    if (a11y.screenReader) {
      const msg =
        size === 'large'
          ? isVi
            ? 'Đã bật chữ lớn'
            : 'Large text enabled'
          : size === 'small'
            ? isVi
              ? 'Đã bật chữ nhỏ'
              : 'Compact text enabled'
            : isVi
              ? 'Chữ cỡ bình thường'
              : 'Normal text size'
      speakWithLang(msg, lang)
    }
  }

  const toggleAudio = (next: boolean) => {
    setA11y({ screenReader: next })
    track(next ? 'menu-audio-on' : 'menu-audio-off')
    if (next) {
      speakWithLang(isVi ? 'Hỗ trợ âm thanh đã bật' : 'Audio support enabled', lang)
    }
  }

  const toggleContrast = (next: boolean) => {
    setA11y({ highContrast: next })
    track(next ? 'menu-contrast-on' : 'menu-contrast-off')
  }

  const closeAnd = (action: () => void, target: string) => {
    track(target)
    setOpen(false)
    action()
  }

  const textOptions: { id: BpTextSize; label: string }[] = [
    { id: 'small', label: isVi ? 'Chữ nhỏ' : 'Small' },
    { id: 'normal', label: isVi ? 'Bình thường' : 'Normal' },
    { id: 'large', label: isVi ? 'Chữ lớn' : 'Large' },
  ]

  const menu = (
    <div className="bp-hamburger-layer" data-bp-menu="true">
      <button
        type="button"
        className="bp-hamburger-btn"
        aria-label={menuLabel}
        aria-expanded={open}
        aria-controls="bp-interaction-panel"
        onClick={() => {
          track(open ? 'menu-close' : 'menu-open')
          setOpen((v) => !v)
        }}
      >
        {open ? <X className="h-6 w-6" strokeWidth={2.5} /> : <Menu className="h-6 w-6" strokeWidth={2.5} />}
      </button>

      {open && (
        <button
          type="button"
          className="bp-hamburger-backdrop"
          aria-label={isVi ? 'Đóng menu' : 'Close menu'}
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        id="bp-interaction-panel"
        className={`bp-hamburger-panel ${open ? 'bp-hamburger-panel--open' : ''}`}
        aria-hidden={!open}
      >
        <header className="mb-3 flex items-center justify-between gap-2 border-b border-kiosk-border pb-3">
          <h2 className="font-bold text-neon-green">{title}</h2>
          <button
            type="button"
            className="rounded-lg p-1 text-gray-500 hover:bg-kiosk-panel"
            aria-label={isVi ? 'Đóng' : 'Close'}
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <section className="mb-4">
          <p className="mb-2 text-[var(--bp-caption,0.8125rem)] font-semibold uppercase tracking-wide text-gray-500">
            {isVi ? 'Cỡ chữ' : 'Text size'}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {textOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => applyTextSize(opt.id)}
                className={`btn-kiosk rounded-lg border-2 py-2.5 text-sm font-bold transition ${
                  textSize === opt.id
                    ? 'border-neon-green bg-neon-green text-white'
                    : 'border-kiosk-border bg-white text-gray-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <MenuToggle
            label={isVi ? 'Hỗ trợ âm thanh' : 'Audio support'}
            description={isVi ? 'Đọc thông báo và xác nhận thao tác' : 'Spoken feedback for actions'}
            checked={a11y.screenReader}
            onChange={toggleAudio}
            icon={<Volume2 className="h-5 w-5" />}
          />
          <MenuToggle
            label={isVi ? 'Tương phản cao' : 'High contrast'}
            description={isVi ? 'Dễ nhìn hơn dưới ánh nắng' : 'Easier to read in bright light'}
            checked={a11y.highContrast}
            onChange={toggleContrast}
          />
        </section>

        <section className="mt-4 space-y-2 border-t border-kiosk-border pt-4">
          <p className="mb-2 text-[var(--bp-caption,0.8125rem)] font-semibold uppercase tracking-wide text-gray-500">
            {isVi ? 'Điều hướng' : 'Navigation'}
          </p>
          <button
            type="button"
            className="btn-kiosk flex w-full items-center gap-3 rounded-xl border-2 border-kiosk-border bg-white px-4 py-3 text-left font-semibold"
            onClick={() => closeAnd(onHelp, 'menu-help')}
          >
            <Headphones className="h-5 w-5 shrink-0 text-neon-cyan" />
            {tr('help', lang)}
          </button>
          {screen !== 'list' && (
            <button
              type="button"
              className="btn-kiosk flex w-full items-center gap-3 rounded-xl border-2 border-kiosk-border bg-white px-4 py-3 text-left font-semibold"
              onClick={() => closeAnd(onList, 'menu-list')}
            >
              <List className="h-5 w-5 shrink-0 text-neon-green" />
              {tr('switchList', lang)}
            </button>
          )}
          {screen !== 'map' && screen !== 'home' && (
            <button
              type="button"
              className="btn-kiosk flex w-full items-center gap-3 rounded-xl border-2 border-kiosk-border bg-white px-4 py-3 text-left font-semibold"
              onClick={() => closeAnd(onMap, 'menu-map')}
            >
              <Map className="h-5 w-5 shrink-0 text-neon-green" />
              {tr('switchMap', lang)}
            </button>
          )}
        </section>
      </aside>
    </div>
  )

  if (kioskPane) return createPortal(menu, kioskPane)
  return menu
}
